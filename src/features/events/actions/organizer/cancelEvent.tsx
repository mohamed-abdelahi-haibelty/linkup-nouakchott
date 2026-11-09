"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { sendPushNotifications } from "@/server/notifications";
import { revalidatePath } from "next/cache";

export async function cancelEvent(eventId: string) {
  const { success, message, user, code } = await requireAuthUser();
  if (!success || !user) return { success, message, data: null, code };

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        organizerId: user.id,
      },
      include: {
        participants: {
          include: {
            participant: {
              include: {
                pushSubscriptions: true,
              },
            },
          },
        },
      },
    });

    if (!event)
      return {
        success: false,
        message: "Event not found",
        data: null,
        code: 404,
      };

    if (event.status === "cancelled")
      return {
        success: false,
        message: "Event already cancelled",
        data: null,
        code: 409,
      };

    const now = new Date();

    if (event.endTime <= now)
      return {
        success: false,
        message: "Cannot cancel a past event",
        data: null,
      };

    // update event
    await prisma.event.update({
      where: {
        id: eventId,
        organizerId: user.id,
      },
      data: { status: "cancelled", cancelledAt: new Date() },
    });

    // cancel tickets
    await prisma.ticket.updateMany({
      where: { id: eventId },
      data: { status: "cancelled" },
    });

    //create in-app  notifications for all participants
    const notificationPromises = event.participants.map((p) =>
      prisma.notification.create({
        data: {
          userId: p.participantId,
          title: `Event "${event.title}" was cancelled`,
          message: `The organizer has cancelled the event "${event.title}".`,
          type: "event_cancelled",
          actionUrl: `/notifications`,
        },
      }),
    );

    await Promise.all(notificationPromises);

    // prepare push subscriptions
    const allSubscriptions = event.participants.flatMap(
      (p) => p.participant.pushSubscriptions,
    );

    // send push notifications
    if (allSubscriptions.length > 0) {
      await sendPushNotifications(
        allSubscriptions,
        "Event Cancelled",
        `The event "${event.title}" has been cancelled.`,
        `/notifications`,
      );
    }

    revalidatePath("/events");
    revalidatePath(`/manage`);
    revalidatePath(`/notifications`);

    return { success: true, message: "Event Cancelled", data: event };
  } catch (error) {
    return handlePrismaError(error);
  }
}
