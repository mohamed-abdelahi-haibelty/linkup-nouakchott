"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendPushNotifications } from "../notifications/sendPushNotifications";
import { handlePrismaError } from "@/lib/utils";

import { EventStatus, NotificationType } from "@prisma/client";
import { getUserRole } from "../../user/getUserRole";

export async function changeEventStatus(eventId: string, status: EventStatus) {
  try {
    const { success, user, message } = await getUserRole();
    if (!success || !user) return { success, message, data: null };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to change event status.",
        data: null,
      };
    }

    // Get the event with organizer info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          include: {
            pushSubscriptions: true,
          },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found.",
        data: null,
      };
    }

    // Update event status with approval/rejection timestamp
    const updateData: any = { status };

    if (status === "approved") {
      updateData.approvedAt = new Date();
      updateData.approvedById = user.id;
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
    } else if (status === "cancelled") {
      updateData.cancelledAt = new Date();
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    // Prepare notification data based on status
    let notificationTitle = "";
    let notificationBody = "";
    let notificationType: NotificationType = "event_update";
    let actionUrl = "";

    if (status === "approved") {
      notificationTitle = "Event Approved!";
      notificationBody = `Great news! Your event "${event.title}" has been approved and is now live. People can start registering!`;
      notificationType = "event_accepted";
      actionUrl = `/events/${event.id}_${event.slug}`; // Redirect to the event page
    } else if (status === "rejected") {
      notificationTitle = "Event Review Update";
      notificationBody = `Unfortunately, your event "${event.title}" was not approved. Please review our guidelines or contact support for more information.`;
      notificationType = "event_update";
      actionUrl = `/events/create`; // Redirect to create page to try again
    } else if (status === "cancelled") {
      notificationTitle = "Event Cancelled";
      notificationBody = `Your event "${event.title}" has been cancelled.`;
      notificationType = "event_cancelled";
      actionUrl = `/events`; // Redirect to events list
    }

    // Create in-app notification in database
    await prisma.notification.create({
      data: {
        userId: event.organizerId,
        title: notificationTitle,
        message: notificationBody,
        type: notificationType,
        actionUrl: actionUrl,
      },
    });

    // Send push notification to all organizer's subscriptions
    if (event.organizer.pushSubscriptions.length > 0) {
      await sendPushNotifications(
        event.organizer.pushSubscriptions,
        notificationTitle,
        notificationBody,
        actionUrl
      );
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return {
      success: true,
      message: "Event status updated",
      data: updatedEvent,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
