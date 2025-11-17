"use client";

import { Notification } from "@prisma/client";
import { NotificationCard } from "./notificationCard";
import { NotificationsEmpty } from "./notificationsEmpty";

export function NotificationsList({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return <NotificationsEmpty />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
