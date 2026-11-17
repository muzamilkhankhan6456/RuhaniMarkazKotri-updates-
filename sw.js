const CACHE = "ruhani-markaz-v4";
const FILES_TO_CACHE = [
  "/RuhaniMarkazKotri-updates-/",
  "/RuhaniMarkazKotri-updates-/index.html",
  "/RuhaniMarkazKotri-updates-/manifest.json",
  "/RuhaniMarkazKotri-updates-/icon-192.png",
  "/RuhaniMarkazKotri-updates-/icon-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).catch(() => {})
  );
});

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

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("firebase") || e.request.url.includes("googleapis") || e.request.url.includes("gstatic")) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        let resClone = res.clone();
        caches.open(CACHE).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
