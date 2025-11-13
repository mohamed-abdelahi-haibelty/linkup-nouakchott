"use server";
import prisma from "@/lib/db";
import { EventWithParticipants } from "@/types";
import { logError } from "@/lib/sentry";

type EventsResponse =
  | {
      data: EventWithParticipants[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
      error?: null;
    }
  | {
      data: [];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
      error: string;
    };

type Props = {
  query?: string;
  limit: number;
  page: number;
};

export async function getEvents({
  query,
  limit,
  page,
}: Props): Promise<EventsResponse> {
  if (page < 1 || limit < 1 || limit > 100) {
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      error: "Invalid pagination parameters",
    };
  }

  const skip = (page - 1) * limit;

  const where = query?.trim()
    ? {
        OR: [
          { title: { contains: query.trim(), mode: "insensitive" as const } },
          {
            description: {
              contains: query.trim(),
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  try {
    const [events, total] = await Promise.all([
      prisma?.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          participants: {
            include: {
              participant: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      data: events,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    logError(err);
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      error: "Failed to fetch events",
    };
  }
}
