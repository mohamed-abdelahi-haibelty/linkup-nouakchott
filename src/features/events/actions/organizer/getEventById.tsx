"use server";
import prisma from "@/lib/db";
import { logError } from "@/lib/sentry";
import { publicUserSelect } from "@/server/public-user";
import {
  EventWithParticipantsAndCounts,
  ParticipantWithUserAndCount,
} from "@/types/index";
import { cache } from "react";

export const getEventById = cache(
  async (id: string): Promise<EventWithParticipantsAndCounts | null> => {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id,
          status: { in: ["approved", "demo"] },
          deletedAt: null,
        },
        include: {
          participants: {
            include: {
              participant: { select: publicUserSelect },
            },
          },
          organizer: {
            include: {
              events: { select: { id: true } },
            },
          },
        },
      });

      if (!event) return null;

      const participantIds = event.participants.map((p) => p.participantId);
      const organizerEventCount = event?.organizer?.events.length ?? 0;

      let countMap = {} as Record<string, number>;

      if (participantIds.length > 0) {
        const attendedCounts = await prisma.participant.groupBy({
          by: ["participantId"],
          where: {
            participantId: { in: participantIds },
            status: "confirmed",
          },
          _count: { _all: true },
        });

        countMap = attendedCounts.reduce(
          (acc, row) => {
            acc[row.participantId] = row._count._all;
            return acc;
          },
          {} as Record<string, number>,
        );
      }

      const participantsWithCount = event.participants.map((p) => {
        return {
          ...p,
          attendedEventsCount: countMap[p.participantId] ?? 0,
        } as ParticipantWithUserAndCount;
      });

      return {
        ...event,
        participants: participantsWithCount,
        organizer: {
          ...event.organizer,
          hostedEventsCount: organizerEventCount,
        },
      };
    } catch (err) {
      console.error(`Error fetching event with id ${id}:`, err);
      logError(err);
      throw new Error("Failed to fetch event");
    }
  },
);
