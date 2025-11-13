// custom-sw.js
console.log("Custom Service Worker loaded");

// Push notification event listener
self.addEventListener("push", (event) => {
  console.log("[Custom SW] Push notification received:", event);

  if (!event.data) {
    console.log("[Custom SW] No data in push event");
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log("[Custom SW] Parsed push data:", data);
  } catch (e) {
    console.error("[Custom SW] Error parsing push data:", e);
    data = {
      title: "Notification",
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon512_maskable.png",
    badge: data.badge || "/icon512_maskable.png",
    data: {
      url: data.url || "/events",
    },
    vibrate: [200, 100, 200],
    tag: "event-notification",
    requireInteraction: false,
    actions: [
      {
        action: "open",
        title: "View",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  const promiseChain = self.registration
    .showNotification(data.title || "Notification", options)
    .then(() => {
      console.log("[Custom SW] Notification displayed successfully");
    })
    .catch((error) => {
      console.error("[Custom SW] Error showing notification:", error);
    });

  event.waitUntil(promiseChain);
});

// Notification click event listener
self.addEventListener("notificationclick", (event) => {
  console.log("[Custom SW] Notification clicked:", event);
  event.notification.close();

  // Handle action buttons
  if (event.action === "close") {
    console.log("[Custom SW] Close action clicked");
    return;
  }

  const urlToOpen = event.notification.data?.url || "/events";
  console.log("[Custom SW] Opening URL:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        console.log("[Custom SW] Found clients:", clientList.length);

        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            console.log("[Custom SW] Focusing existing window");
            return client.focus();
          }
        }

        // Check if any window is open
        for (const client of clientList) {
          if ("focus" in client) {
            console.log("[Custom SW] Navigating existing window");
            client.focus();
            return client.navigate(urlToOpen);
          }
        }

        // Open new window if none found
        if (clients.openWindow) {
          console.log("[Custom SW] Opening new window");
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error("[Custom SW] Error handling notification click:", error);
      })
  );
});

// Notification close event listener
self.addEventListener("notificationclose", (event) => {
  console.log("[Custom SW] Notification was closed:", event);
});
