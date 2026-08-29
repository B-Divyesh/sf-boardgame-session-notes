const CACHE = 'session-notes-shell-v3';
const CORE = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/assets/session-map-768.webp', '/assets/session-map-1536.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('connectivity-check')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => (await caches.match(url.pathname, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || caches.match('/offline.html', { ignoreVary: true })));
    return;
  }
  event.respondWith(caches.match(url.pathname, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && ['script', 'style', 'image', 'font'].includes(event.request.destination)) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  })));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
