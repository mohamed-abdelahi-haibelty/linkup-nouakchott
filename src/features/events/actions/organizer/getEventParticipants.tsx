"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { ActionsResponse, ParticipantWithUser } from "@/types/index";

export async function getEventParticipants(
  eventId: string,
): Promise<ActionsResponse<ParticipantWithUser[]>> {
  const { success, message, user, code } = await requireAuthUser();
  if (!success || !user) return { success, message, data: null, code };

  try {
    const participants = await prisma.participant.findMany({
      where: {
        eventId: eventId,
        event: { organizerId: user.id },
      },
      include: {
        participant: true,
      },
    });

    return { success: true, message: "ok", data: participants, code: 200 };
  } catch (error) {
    return handlePrismaError(error);
  }
}
