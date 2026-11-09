import prisma from "@/lib/db";
import { logError } from "@/lib/sentry";
import type { PushSubscription } from "@prisma/client";
import "server-only";
import webpush from "web-push";

export async function sendPushNotifications(
  subscriptions: Pick<PushSubscription, "endpoint" | "keys">[],
  title: string,
  body: string,
  url = "/events",
) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails(
    process.env.WEB_PUSH_SUBJECT || "mailto:support@linkupnouakchott.com",
    publicKey,
    privateKey,
  );
  const payload = JSON.stringify({
    title,
    body,
    icon: "/icons/icon512_maskable.png",
    badge: "/icons/icon512_maskable.png",
    url,
  });
  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const keys = subscription.keys;
      if (
        !keys ||
        typeof keys !== "object" ||
        Array.isArray(keys) ||
        typeof keys.auth !== "string" ||
        typeof keys.p256dh !== "string"
      )
        return;
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { auth: keys.auth, p256dh: keys.p256dh },
          },
          payload,
        );
      } catch (error) {
        // Expired subscriptions are removable; temporary provider failures are not.
        if (
          error instanceof webpush.WebPushError &&
          [404, 410].includes(error.statusCode)
        ) {
          await prisma.pushSubscription.deleteMany({
            where: { endpoint: subscription.endpoint },
          });
        } else {
          logError(error, { operation: "push-notification" });
        }
      }
    }),
  );
}
