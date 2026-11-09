const STATIC_CACHE = "linkup-static-v1";
const OFFLINE_PAGE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.add(OFFLINE_PAGE)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((names) => Promise.all(names.filter((name) => name !== STATIC_CACHE).map((name) => caches.delete(name)))),
    self.clients.claim(),
  ]));
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    // Never cache authenticated HTML, API responses, or React Server Component payloads.
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_PAGE)));
    return;
  }
  if (["/_next/static/", "/icons/", "/fonts/"].some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, copy)));
      }
      return response;
    })));
  }
});
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); }
  catch { data = { title: "Linkup", body: event.data.text() }; }
  event.waitUntil(self.registration.showNotification(data.title || "Linkup", {
    body: data.body,
    icon: "/icons/icon512_maskable.png",
    badge: "/icons/icon512_maskable.png",
    data: { url: data.url || "/events" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = new URL(event.notification.data?.url || "/events", self.location.origin);
  if (destination.origin !== self.location.origin) return;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === destination.origin);
    if (existing) { await existing.navigate(destination.href); return existing.focus(); }
    return self.clients.openWindow(destination.href);
  }));
});
