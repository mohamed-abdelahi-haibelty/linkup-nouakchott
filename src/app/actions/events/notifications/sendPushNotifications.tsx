"use server";
import prisma from "@/lib/db";
import webpush from "web-push";

export async function sendPushNotifications(
  subscriptions: any[],
  title: string,
  body: string,
  url?: string
) {
  // Configure VAPID details
  webpush.setVapidDetails(
    "mailto:eminou756@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icon512_maskable.png",
    badge: "/icon512_maskable.png",
    url: url || "/events",
  });

  // Send to all subscriptions
  const sendPromises = subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        payload
      );
      console.log(
        `✅ Push notification sent to ${subscription.endpoint.substring(
          0,
          50
        )}...`
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      // Remove invalid subscription
      await prisma.pushSubscription.delete({
        where: { endpoint: subscription.endpoint },
      });
    }
  });

  await Promise.allSettled(sendPromises);
}
