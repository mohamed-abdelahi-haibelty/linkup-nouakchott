"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeToNotifications } from "@/lib/actions";

interface NotificationPermissionDialogProps {
  open: boolean;
  onComplete: () => void;
}

async function generateSubscriptionEndpoint(
  registration: ServiceWorkerRegistration
) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  const subscriptionJson = JSON.parse(JSON.stringify(subscription));
  console.log("subscription json", subscriptionJson);

  const { success, message } = await subscribeToNotifications(subscriptionJson);

  console.log("success", success);

  if (success) {
    toast(
      "✅ Notifications enabled! You’ll be notified when your event is approved."
    );
  } else {
    toast(message);
  }
}

// Wait for service worker to be ready
async function waitForServiceWorker(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.ready;
  return registration;
}

export function NotificationPermissionDialog({
  open,
  onComplete,
}: NotificationPermissionDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setLoading(true);

    try {
      if (!("serviceWorker" in navigator)) {
        toast.error("Push notifications are not supported in this browser.");
        onComplete();
        return;
      }

      if (!("PushManager" in window)) {
        toast.error("Push notifications are not supported in this browser.");
        onComplete();
        return;
      }
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Check if there's already a registration
        let registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
          // Register and wait for it to be ready
          console.log("No registration found, registering service worker...");
          registration = await navigator.serviceWorker.register("/sw.js");
        }

        // Wait for the service worker to be active
        console.log("Waiting for service worker to be ready...");
        const activeRegistration = await waitForServiceWorker();

        console.log("Service worker ready, subscribing to push...");
        await generateSubscriptionEndpoint(activeRegistration);
      } else if (permission === "denied") {
        toast.error(
          "Notification permission denied. Please enable it in your browser settings."
        );
      } else {
        toast.info(
          "You can enable notifications later in your browser settings."
        );
      }

      onComplete();
    } catch (err) {
      console.error("Error enabling notifications", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onComplete}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Notifications</DialogTitle>
          <DialogDescription>
            Get notified when your event is approved by our team.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-3">
          By enabling notifications, you’ll receive important updates such as
          event approvals, cancellations, and reminders directly on your device.
        </p>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onComplete}>
            Maybe Later
          </Button>
          <Button onClick={handleEnableNotifications} disabled={loading}>
            {loading ? "Enabling..." : "Enable Notifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
