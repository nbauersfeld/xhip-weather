// Nur die Seite selbst zwischenspeichern (startet auch ohne Netz und sagt dann "keine Verbindung").
// Die Werte von ntfy nie: sonst zeigte sie alte als neue
const SPEICHER = "wetter-1";
const SEITE = ["./", "manifest.webmanifest", "icon-192.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(SPEICHER).then(c => c.addAll(SEITE))));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== SPEICHER).map(n => caches.delete(n))))));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;   // ntfy: immer frisch
  // Erst das Netz (neue Fassung der Seite), ohne Netz das Gespeicherte
  e.respondWith(fetch(e.request).then(r => {
    const kopie = r.clone();
    caches.open(SPEICHER).then(c => c.put(e.request, kopie));
    return r;
  }).catch(() => caches.match(e.request)));
});
