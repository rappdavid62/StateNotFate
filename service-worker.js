const CACHE_NAME = 'state-not-fate-cache-v5';
const ASSETS_TO_CACHE = [
  './index.html',
  './evidence.html',
  './contact.html',
  './crisis.html',
  './404.html',
  './index.css',
  './app.js',
  './manifest.json',
  './robots.txt',
  './sitemap.xml'
];

// Install Service Worker and cache core recovery assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core recovery assets offline...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up deprecated caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Cleaning up deprecated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: serve cached assets offline immediately, fallback to network
self.addEventListener('fetch', event => {
  // Avoid caching relative media streams (audio/video are too large for service worker cache storage)
  if (event.request.url.includes('.mp4') || event.request.url.includes('.m4a')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then(networkResponse => {
          // Avoid caching post requests or external assets
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        }).catch(() => {
          // Silent catch for offline connection loss
        });
      })
  );
});
