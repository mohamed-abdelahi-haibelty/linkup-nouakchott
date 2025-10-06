"use server";
import prisma from "@/lib/db";
import {
  EventWithParticipants,
  EventWithParticipantsAndCounts,
  ParticipantWithUserAndCount,
} from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CreateEventInput, createEventSchema } from "./validation/event";
import { generateSlug } from "./utils";
import { revalidatePath } from "next/cache";

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

    // Convert Decimal → number safely
    const plainEvents: EventWithParticipants[] = events.map((event) => ({
      ...event,
      price: event.price?.toNumber() ?? 0, // safely convert Decimal to number
    }));

    return {
      data: plainEvents,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    console.error("Error fetching events:", err);
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      error: "Failed to fetch events",
    };
  }
}

export async function getEventById(
  id: string
): Promise<EventWithParticipantsAndCounts | null> {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        participants: {
          include: {
            participant: true,
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

      countMap = attendedCounts.reduce((acc, row) => {
        acc[row.participantId] = row._count._all;
        return acc;
      }, {} as Record<string, number>);
    }

    const participantsWithCount = event.participants.map((p) => {
      return {
        ...p,
        attendedEventsCount: countMap[p.participantId] ?? 0,
      } as ParticipantWithUserAndCount;
    });

    return {
      ...event,
      price: event.price.toNumber() ?? 0,
      participants: participantsWithCount,
      organizer: {
        ...event.organizer,
        hostedEventsCount: organizerEventCount,
      },
    };
  } catch (err) {
    console.error(`Error fetching event with id ${id}:`, err);
    throw new Error("Failed to fetch event");
  }
}

export async function createEventAction(data: CreateEventInput) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    throw new Error("Unautherized user");
  }

  const parsed = createEventSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const user = await getUser();
  const organizerId = user?.id ?? "unkown";

  try {
    const event = await prisma.event.create({
      data: {
        ...parsed.data,
        slug: generateSlug(parsed.data.title),
        organizerId: organizerId,
      },
    });

    revalidatePath("/events");
    return { success: true, event };
  } catch (e) {
    console.error(e);
  }
}
