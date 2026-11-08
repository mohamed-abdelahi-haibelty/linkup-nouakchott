"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Package,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  deleteNotification,
  markNotificationAsRead,
} from "@/features/notifications/actions/notifications";
import { Notification } from "@prisma/client";
import { useTransition } from "react";

const notificationTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  event_update: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: "text-gray-600",
    bg: "bg-red-50",
  },
  event_cancelled: {
    icon: <XCircle className="w-5 h-5" />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  event_accepted: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-gray-600",
    bg: "bg-gray-50 ",
  },
  post_accepted: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
  reminder: {
    icon: <Bell className="w-5 h-5" />,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
  general: {
    icon: <Package className="w-5 h-5" />,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
};

export function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const [isPending, startTransition] = useTransition();
  const isUnread = !notification.readAt;
  const config =
    notificationTypeConfig[notification.type] || notificationTypeConfig.general;

  const handleMarkAsRead = () => {
    startTransition(async () => {
      await markNotificationAsRead(notification.id);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteNotification(notification.id);
    });
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 border",
        isUnread
          ? "bg-card/70 border-primary/20"
          : "bg-card border-border hover:border-border/80",
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0",
            config.bg,
          )}
        >
          <div className={config.color}>{config.icon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground line-clamp-1">
                {notification.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {notification.message}
              </p>
            </div>
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>

            <div className="flex gap-1 ml-auto">
              {isUnread && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  disabled={isPending}
                  className="h-7 px-2 text-xs"
                >
                  {isPending ? "..." : "Mark read"}
                </Button>
              )}

              {notification.actionUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    notification.actionUrl &&
                    (window.location.href = notification.actionUrl)
                  }
                  disabled={isPending}
                  className="h-7 px-2 text-xs"
                >
                  View
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isPending}
                className="h-7 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
