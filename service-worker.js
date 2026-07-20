const CACHE_NAME = 'caa-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'modules.json',
  'core/app.js',
  'core/storage.js',
  'core/speech-engine.js',
  'core/sentence-engine.js',
  'core/module-loader.js',
  'core/accessibility.js',
  'modules/basic/module.json',
  'modules/food/module.json',
  'modules/emotions/module.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Ejecutar actualización en background de forma asíncrona
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => /* Silenciar fallos de red offline */);
        
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});