const CACHE = "arctic-cloud-booking-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  if (url.hostname.includes("script.google.com")) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
