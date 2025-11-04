// Push notification event listener
self.addEventListener("push", (event) => {
  console.log("Push notification received", event);

  if (!event.data) {
    console.log("No data in push event");
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Error parsing push data:", e);
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

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event listener
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);
  event.notification.close();

  // Handle action buttons
  if (event.action === "close") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/events";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        // Check if any window is open
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            return client.navigate(urlToOpen);
          }
        }

        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event listener
self.addEventListener("notificationclose", (event) => {
  console.log("Notification was closed", event);
});
