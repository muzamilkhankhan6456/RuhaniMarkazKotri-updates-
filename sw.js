const CACHE = "ruhani-markaz-v2";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install - Sab Files Save Karo
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate - Purana Cache Delete Karo
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Offline Bhi App Chalegi
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(e.request).then((response) => {
        if (e.request.url.startsWith("http") && response.status === 200) {
          let copy = response.clone();
          caches.open(CACHE).then((cache) => {
            cache.put(e.request, copy);
          });
        }
        return response;
      }).catch(() => {
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});