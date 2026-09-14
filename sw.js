// Çevrimdışı oynanabilmesi için basit service worker.
// Önce ağdan dener (güncellemeler hemen gelsin), ağ yoksa önbellekten sunar.
const CACHE = 'slm-v1';
const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/main.js',
  'js/data/teams.js',
  'js/engine/util.js',
  'js/engine/players.js',
  'js/engine/tactics.js',
  'js/engine/match.js',
  'js/engine/inbox.js',
  'js/engine/transfers.js',
  'js/engine/game.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))),
  );
});
