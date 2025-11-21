import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

export function NotificationsEmpty() {
  return (
    <Card className="p-12 border-dashed">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-3 rounded-lg bg-muted">
          <Bell className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            No notifications yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up! Come back soon for updates about events and
            activities.
          </p>
        </div>
      </div>
    </Card>
  );
}
