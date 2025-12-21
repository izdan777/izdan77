const CACHE_NAME = "portal-cache-v1";
const urlsToCache = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "portalicon.png",
  "manifest.json",
  "firebase-config.js"
  // Add more files here if needed, like PDF or images you want offline
];

// Install Service Worker and cache files
self.addEventListener("install", (event) => {
  console.log("Service Worker Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell");
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Serve cached file if available
        if (response) return response;

        // Otherwise fetch from network
        return fetch(event.request)
          .catch(() => {
            // Optional: fallback offline page or message
            return new Response("You are offline.");
          });
      })
  );
});
