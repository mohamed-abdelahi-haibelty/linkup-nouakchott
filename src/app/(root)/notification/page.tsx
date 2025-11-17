import { getNotifications } from "@/app/actions/notification/notifications";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NotificationsHeader } from "./components/notificationsHeader";
import { NotificationsList } from "./components/notificationsList";

export const metadata = {
  title: "Notifications",
  description: "View all your notifications",
};

export default async function NotificationsPage() {
  const response = await getNotifications(50);

  if (!response.success) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Unable to load notifications. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const notifications = response.data || [];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <NotificationsHeader unreadCount={unreadCount} />

        <NotificationsList notifications={notifications} />
      </div>
    </div>
  );
}
