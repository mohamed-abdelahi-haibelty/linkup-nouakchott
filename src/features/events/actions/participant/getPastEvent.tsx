"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";
import { publicUserSelect } from "@/server/public-user";

import { ActionsResponse, EventWithParticipants } from "@/types/index";

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
      include: {
        participants: {
          include: { participant: { select: publicUserSelect } },
        },
      },
      orderBy: { endTime: "desc" },
    });

    return { success: true, message: "ok", data: events, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
