"use server";
import prisma from "@/lib/db";
import { generateUniqueTicketCode, handlePrismaError } from "@/lib/utils";

import { requireAuthUser } from "@/lib/auth";
import { sendTicketEmail } from "@/lib/email";
import { sendPushNotifications } from "../notifications/sendPushNotifications";
import { revalidatePath } from "next/cache";

export async function confirmParticipantPayment(id: string, eventId: string) {
  try {
    const { success, user, message, code } = await requireAuthUser();
    if (!success || !user) return { success, message, data: null, code };

    // 1. check permission
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event)
      return {
        success: false,
        message: "Event Not found",
        data: null,
        code: 404,
      };

    if (event.organizerId !== user.id) {
      return {
        success: false,
        message: "Unauthorized",
        data: null,
        code: 403,
      };
    }

    // 2. change status
    const participant = await prisma.participant.update({
      where: {
        id: id,
      },
      data: {
        status: "paid",
      },
      include: {
        participant: {
          include: {
            pushSubscriptions: true,
          },
        },
      },
    });

    // 3. send email
    const qrcode = await generateUniqueTicketCode();
    await prisma.ticket.create({
      data: {
        eventId: event.id,
        userId: user?.id,
        issuedAt: new Date(),
        code: qrcode,
      },
    });

    const checkinUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkin/${code}`;
    const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      checkinUrl
    )}`;

    if (user.email) {
      await sendTicketEmail(
        user.email,
        event.title,
        event.startTime,
        event.endTime,
        qrDataUrl
      );
    }

    // 4 create in-app notification
    const notificationTitle = "Registration Confirmed";
    const notificationBody = `Your registration for "${event.title}" has been confirmed! A confirmation email with your ticket and QR code has been sent to you.`;
    const notificationType = "general";
    const actionUrl = `/notifications`;

    await prisma.notification.create({
      data: {
        userId: participant.participantId,
        title: notificationTitle,
        message: notificationBody,
        type: notificationType,
        actionUrl: actionUrl,
      },
    });

    // 5. Send push notification to participant
    if (participant.participant.pushSubscriptions.length > 0) {
      await sendPushNotifications(
        participant.participant.pushSubscriptions,
        notificationTitle,
        notificationBody,
        actionUrl
      );
    }

    revalidatePath(`/manage/event/${event.id}/participants`);

    return {
      success,
      message: "Registration Confirmed",
      data: null,
      code: 204,
    };
  } catch (err) {
    console.log("err", err);
    return handlePrismaError(err);
  }
}
