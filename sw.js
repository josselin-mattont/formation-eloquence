const CACHE = 'eloquence-v6';
const FICHIERS = ['./', './index.html', './cartes-a-imprimer.html', './manifest.webmanifest', './icone-192.png', './icone-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(rep => {
      if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); }
      return rep;
    }).catch(() => caches.match('./index.html')))
  );
});
