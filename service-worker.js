const CACHE_NAME = 'state-not-fate-cache-v11';
const ASSETS_TO_CACHE = [
  './index.html',
  './evidence.html',
  './contact.html',
  './crisis.html',
  './404.html',
  './suicide-prevention.html',
  './essays.html',
  './index.css',
  './app.js',
  './manifest.json',
  './robots.txt',
  './sitemap.xml'
];

function isCoreShellRequest(request) {
  if (request.method !== 'GET') return false;
  try {
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return false;
    if (request.mode === 'navigate') return true;
    const path = url.pathname;
    if (path === '/' || path.endsWith('.html')) return true;
    if (path.endsWith('/app.js') || path.endsWith('/index.css')) return true;
    return false;
  } catch {
    return false;
  }
}

function cacheIfValid(request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, copy);
    });
  }
  return response;
}

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

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('.mp4') || event.request.url.includes('.m4a')) {
    return;
  }

  if (isCoreShellRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => cacheIfValid(event.request, networkResponse))
        .catch(() => caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return undefined;
        }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(networkResponse => {
          return cacheIfValid(event.request, networkResponse);
        }).catch(() => {
          // Silent catch for offline connection loss
        });
      })
  );
});
