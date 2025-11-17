"use client";

import { markAllNotificationsAsRead } from "@/app/actions/notification/notifications";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function NotificationsHeader({ unreadCount }: { unreadCount: number }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            You have{" "}
            <span className="font-semibold text-foreground">
              {unreadCount} unread
            </span>{" "}
            notification{unreadCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={isPending}
        >
          {isPending ? "Marking..." : "Mark all as read"}
        </Button>
      )}
    </div>
  );
}
