"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse, EventWithParticipantsCount } from "@/types";
import { EventStatus } from "@prisma/client";

export async function getHostedEvents(): Promise<
  ActionsResponse<EventWithParticipantsCount[]>
> {
  try {
    const { user, message, success, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    const eventsData = await prisma.event.findMany({
      where: {
        organizerId: user.id,
        status: { in: [EventStatus.approved, EventStatus.cancelled] },
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // map _count.participants → participantsCount
    const events: EventWithParticipantsCount[] = eventsData.map(
      ({ _count, ...rest }) => ({
        ...rest,
        participantsCount: _count?.participants ?? 0,
      })
    );

    return { message: "ok", success: true, data: events, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
