"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { handlePrismaError } from "@/lib/utils";

export async function leaveEvent(eventId: string): Promise<ActionsResponse> {
  try {
    const { success, message, user, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found. It may have been deleted or cancelled.",
        data: null,
        code: 404,
      };
    }

    // Check if the user is registered for this event
    const participant = await prisma.participant.findUnique({
      where: {
        participantId_eventId: {
          participantId: user.id,
          eventId: event.id,
        },
      },
    });

    if (!participant) {
      return {
        success: false,
        message: "You are not registered for this event.",
        data: null,
        code: 403,
      };
    }

    // Prevent leaving after the event has started
    const now = new Date();
    if (now >= event.startTime) {
      return {
        success: false,
        message: "You cannot leave an event that has already started.",
        data: null,
        code: 409,
      };
    }

    // Prevent leaving if the participant has paid for the event
    if (!event.isFree && participant.status === "paid") {
      return {
        success: false,
        message: "You cannot leave a paid event after completing payment.",
        data: null,
        code: 409,
      };
    }

    // Delete any existing ticket for this user/event
    await prisma.ticket.deleteMany({
      where: {
        eventId: event.id,
        userId: user.id,
      },
    });

    await prisma.participant.delete({
      where: {
        participantId_eventId: {
          participantId: user?.id,
          eventId: event.id,
        },
      },
    });

    const url = `events/${eventId}_${event.slug}`;

    revalidatePath(url);

    return {
      success: true,
      message: "You have successfully left the event.",
      data: null,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
