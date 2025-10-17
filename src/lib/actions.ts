"use server";
import prisma from "@/lib/db";
import QRCode from "qrcode";
import {
  ActionsResponse,
  EventWithParticipants,
  EventWithParticipantsAndCounts,
  ParticipantWithUserAndCount,
} from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CreateEventInput, createEventSchema } from "./validation/event";
import { generateSlug, generateUniqueTicketCode } from "./utils";
import { revalidatePath } from "next/cache";
import { Participant, Prisma, RegistrationStatus } from "@prisma/client";
import { Resend } from "resend";
import TicketEmail from "@/app/emails/TicketEmail";

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

type JoinEventResponse = {
  participant: Participant;
  qrDataUrl: string;
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
        price: parsed.data?.price ?? 0,
        slug: generateSlug(parsed.data.title),
        organizerId: organizerId,
      },
    });

    revalidatePath("/events");
    return {
      success: true,
      event,
      message: "Event created successfully!",
    };
  } catch (e) {
    console.error(e);
    // Handle Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // Unique constraint violation
        const target = e.meta?.target as string[] | undefined;
        if (target?.includes("slug")) {
          return {
            success: false,
            message:
              "An event with this title already exists. Please use a different title.",
          };
        }
        return {
          success: false,
          message: "An event with similar details already exists.",
        };
      }

      if (e.code === "P2003") {
        // Foreign key constraint violation
        return {
          success: false,
          message: "Invalid reference data. Please check your inputs.",
        };
      }
    }
    return {
      success: false,
      message: "Failed to create event. Please try again.",
    };
  }
}

export async function joinEventAction(
  eventId: string
): Promise<ActionsResponse<JoinEventResponse>> {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    throw new Error("Unautherized user");
  }

  const user = await getUser();

  if (!user) {
    throw new Error("User session not found. Please log in again.");
  }

  const alreadyRegistered = await prisma.participant.findUnique({
    where: {
      participantId_eventId: {
        eventId,
        participantId: user?.id ?? "",
      },
    },
  });

  if (alreadyRegistered) {
    throw new Error("You are already registered for this event");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error("Event not Found");
  }

  if (user?.id === event.organizerId) {
    throw new Error("The organizer can't join his own event");
  }

  const now = new Date();

  // Check registration deadline
  if (now > event.registrationDeadline) {
    throw new Error("Registration deadline has passed");
  }

  //  Check if the event has already ended
  if (now > event.endTime) {
    throw new Error("This event has already ended");
  }

  const participantCount = await prisma.participant.count({
    where: { eventId },
  });

  if (participantCount >= event?.capacity!) {
    throw new Error("Event is full");
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
    qrDataUrl = await QRCode.toDataURL(checkinUrl, {
      margin: 1,
      scale: 6,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (user.email) {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: "eminou756@gmail.com",
        subject: `🎟️ Your ticket for ${event.title}`,
        html: `<h1>hello</h1>`,
      });
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
  };
}

export async function leaveEventAction(
  eventId: string
): Promise<ActionsResponse> {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized. Please log in to continue.");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found. It may have been deleted or cancelled.");
  }

  const user = await getUser();

  if (!user) {
    throw new Error("User session not found. Please log in again.");
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
    throw new Error("You are not registered for this event.");
  }

  // Prevent leaving after the event has started
  const now = new Date();
  if (now >= event.startTime) {
    throw new Error("You cannot leave an event that has already started.");
  }

  // Prevent leaving if the participant has paid for the event
  if (!event.isFree && participant.status === "paid") {
    throw new Error("You cannot leave a paid event after completing payment.");
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
  };
}
