/* Service Worker - Planner 2026
   Estrategia: cache-first para assets locales, network-first para CDN (con fallback a cache).
*/
const CACHE_VERSION = "planner-2026-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "../img/favicon.svg"
];

const CDN_ASSETS = [
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
];

/* INSTALL — precachea core + intenta precachear CDN */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Precache core (obligatorio)
      return cache.addAll(CORE_ASSETS).then(() => {
        // CDN: precache best-effort (no fallar el install si falla)
        return Promise.allSettled(
          CDN_ASSETS.map((url) =>
            fetch(url, { mode: "no-cors" })
              .then((res) => cache.put(url, res))
              .catch(() => null)
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

/* ACTIVATE — limpia caches viejos */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* FETCH — cache-first con network fallback */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo GET
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Solo cachear respuestas válidas (200 / opaque)
          if (
            response &&
            (response.status === 200 || response.type === "opaque")
          ) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // Fallback: si piden HTML y no hay red, servir index
          if (request.destination === "document") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
