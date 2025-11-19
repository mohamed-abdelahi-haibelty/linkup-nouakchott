"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { logWarning } from "@/lib/sentry";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse } from "@/types";

export async function verifyTicket(
  code: string
): Promise<ActionsResponse<{ eventId: string }>> {
  try {
    const {
      success,
      message,
      user,
      code: statusCode,
    } = await requireAuthUser();

    if (!success || !user)
      return { success, message, data: null, code: statusCode };

    const ticket = await prisma.ticket.findUnique({
      where: {
        code,
      },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      return {
        success: false,
        message: "Ticket not found.",
        data: null,
        code: 404,
      };
    }

    if (ticket.event.organizerId !== user.id) {
      logWarning("Unauthorized ticket scan attempt", {
        userId: user.id,
        eventId: ticket.event.id,
      });
      return {
        success: false,
        message: "Unauthorized access.",
        data: null,
        code: 403,
      };
    }

    const now = new Date();
    const startTime = new Date(ticket.event.startTime);
    const endTime = new Date(ticket.event.endTime);
    const twoHoursBeforeStart = new Date(
      startTime.getTime() - 2 * 60 * 60 * 1000
    );

    if (now < twoHoursBeforeStart) {
      return {
        success: false,
        message: "Check-in opens 2 hours before event start.",
        data: null,
        code: 409,
      };
    }

    if (now > endTime) {
      return {
        success: false,
        message: "Event has ended. Check-in is no longer available.",
        data: null,
        code: 409,
      };
    }

    if (ticket.status !== "active") {
      return {
        success: false,
        message: "Ticket already used.",
        data: null,
        code: 409,
      };
    }

    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "used",
        scannedBy: user.id,
      },
    });

    return {
      success: true,
      message: `✅ Ticket verified: ${code}`,
      data: { eventId: ticket.event.id },
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
