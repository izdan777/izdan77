const CACHE_NAME = "portal-cache-v1";
const urlsToCache = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "portalicon.png",
  "manifest.json",
  "firebase-config.js"
  // Add more files you want offline (like PDFs/images)
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => new Response("You are offline."));
    })
  );
});
