"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { sendTicketEmail } from "@/lib/email";
import { generateUniqueTicketCode, handlePrismaError } from "@/lib/utils";
import { ActionsResponse } from "@/types";
import { Participant, RegistrationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type JoinEventResponse = {
  participant: Participant;
  qrDataUrl: string;
};

export async function joinEvent(
  eventId: string
): Promise<ActionsResponse<JoinEventResponse>> {
  try {
    const { success, message, user, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    const existing = await prisma.participant.findUnique({
      where: {
        participantId_eventId: {
          eventId,
          participantId: user?.id ?? "",
        },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "You are already registered for this event.",
        data: null,
        code: 409,
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found.",
        data: null,
        code: 404,
      };
    }

    if (user?.id === event.organizerId) {
      return {
        success: false,
        message: "The organizer cannot join their own event.",
        data: null,
        code: 409,
      };
    }

    const now = new Date();

    // Check registration deadline
    if (now > event.registrationDeadline) {
      return {
        success: false,
        message: "Registration deadline has passed.",
        data: null,
        code: 409,
      };
    }

    //  Check if the event has already ended
    if (now > event.endTime) {
      return {
        success: false,
        message: "This event has already ended.",
        data: null,
        code: 409,
      };
    }

    const participantCount = await prisma.participant.count({
      where: { eventId },
    });
    if (participantCount >= (event?.capacity ?? 0)) {
      return {
        success: false,
        message: "Event is full.",
        data: null,
        code: 409,
      };
    }

    const participant = await prisma.participant.create({
      data: {
        participantId: user?.id,
        eventId,
        status: event?.isFree
          ? RegistrationStatus.confirmed
          : RegistrationStatus.pending,
        confirmedAt: event?.isFree ? new Date() : null,
      },
    });

    // if confirmed, issue a ticket immediately
    let qrDataUrl = "";
    if (event.isFree) {
      const code = await generateUniqueTicketCode();
      await prisma.ticket.create({
        data: {
          eventId: event.id,
          userId: user?.id,
          issuedAt: new Date(),
          code: code,
        },
      });

      const checkinUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkin/${code}`;
      qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
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
    }

    const url = `events/${eventId}_${event.slug}`;

    revalidatePath(url);

    return {
      success: true,
      message: event?.isFree
        ? "You have successfully joined this event!"
        : "Registration submitted! Awaitting confirmation!",
      data: { participant, qrDataUrl },
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
