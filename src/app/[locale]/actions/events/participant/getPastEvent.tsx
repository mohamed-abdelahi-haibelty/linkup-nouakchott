"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse, EventWithParticipants } from "@/types";

export async function getPastEvents(): Promise<
  ActionsResponse<EventWithParticipants[]>
> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  const now = new Date();

  try {
    const events = await prisma.event.findMany({
      where: {
        endTime: { lt: now },
        participants: {
          some: { participantId: user.id },
        },
      },
      include: { participants: { include: { participant: true } } },
      orderBy: { endTime: "desc" },
    });

    return { success: true, message: "ok", data: events, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
