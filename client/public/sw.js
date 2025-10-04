const CACHE_NAME = 'zetflix-v2'
const STATIC_CACHE = 'zetflix-static-v2'
const DYNAMIC_CACHE = 'zetflix-dynamic-v2'
const IMAGE_CACHE = 'zetflix-images-v2'

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/zetflix.svg',
  '/zetflix-black.svg',
  '/zetflix-white.svg'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
  self.skipWaiting()
})

// Fetch event with improved caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image' || url.hostname === 'image.tmdb.org') {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then(cache => {
          return cache.match(request)
            .then(response => {
              if (response) return response
              return fetch(request)
                .then(fetchResponse => {
                  cache.put(request, fetchResponse.clone())
                  return fetchResponse
                })
            })
        })
    )
    return
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    )
    return
  }

  // Default strategy for other requests
  event.respondWith(
    caches.match(request)
      .then(response => {
        return response || fetch(request)
          .then(fetchResponse => {
            const responseClone = fetchResponse.clone()
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone))
            return fetchResponse
          })
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE]
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})