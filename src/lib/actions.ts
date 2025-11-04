"use server";
import prisma from "@/lib/db";
import {
  ActionsResponse,
  EventWithOrganizer,
  EventWithParticipants,
  EventWithParticipantsAndCounts,
  ParticipantWithUserAndCount,
  SafeEvent,
} from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CreateEventInput, createEventSchema } from "./validation/event";
import {
  generateSlug,
  generateUniqueTicketCode,
  handlePrismaError,
} from "./utils";
import { revalidatePath } from "next/cache";
import {
  EventStatus,
  NotificationType,
  Participant,
  Prisma,
  RegistrationStatus,
} from "@prisma/client";
import { sendTicketEmail } from "./email";
import { logError, logWarning } from "./sentry";
import { getCurrentUserWithRole, requireAuthUser } from "./auth";
import webpush from "web-push";

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
    logError(err);
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
    logError(err);
    throw new Error("Failed to fetch event");
  }
}

export async function createEventAction(data: CreateEventInput) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    logWarning("Unauthorized user tried to create an event");
    return { success: false, message: "Unauthorized user", data: null };
  }

  const parsed = createEventSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
    };
  }

  const user = await getUser();

  if (!user) {
    logWarning("Authenticated user session not found");
    return {
      message: "User session not found. Please log in again.",
      success: false,
      data: null,
    };
  }

  const organizerId = user?.id;

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
    logError(e, {
      data,
      userId: (await getKindeServerSession().getUser())?.id,
    });
    // Handle Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // Unique constraint violation
        const target = e.meta?.target as string[] | undefined;
        if (target?.includes("slug")) {
          return {
            success: false,
            message: "An event with this title already exists.",
            errorCode: "SLUG_CONFLICT",
          };
        }
        return {
          success: false,
          message: "An event with similar details already exists.",
          errorCode: "DUPLICATE_ENTRY",
        };
      }

      if (e.code === "P2003") {
        // Foreign key constraint violation
        return {
          success: false,
          message: "Invalid reference data. Please check your inputs.",
          errorCode: "FK_CONSTRAINT",
        };
      }
    }
    return {
      success: false,
      message: "Failed to create event. Please try again later.",
      errorCode: "UNEXPECTED_ERROR",
    };
  }
}

export async function joinEventAction(
  eventId: string
): Promise<ActionsResponse<JoinEventResponse>> {
  try {
    const { success, message, user } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null };

    const existing = await prisma.participant.findUnique({
      where: {
        participantId_eventId: {
          eventId,
          participantId: user?.id ?? "",
        },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "You are already registered for this event.",
        data: null,
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return { success: false, message: "Event not found.", data: null };
    }

    if (user?.id === event.organizerId) {
      return {
        success: false,
        message: "The organizer cannot join their own event.",
        data: null,
      };
    }

    const now = new Date();

    // Check registration deadline
    if (now > event.registrationDeadline) {
      return {
        success: false,
        message: "Registration deadline has passed.",
        data: null,
      };
    }

    //  Check if the event has already ended
    if (now > event.endTime) {
      return {
        success: false,
        message: "This event has already ended.",
        data: null,
      };
    }

    const participantCount = await prisma.participant.count({
      where: { eventId },
    });
    if (participantCount >= (event?.capacity ?? 0)) {
      return { success: false, message: "Event is full.", data: null };
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
      qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
        checkinUrl
      )}`;

      if (user.email) {
        await sendTicketEmail(
          user.email,
          event.title,
          event.startTime,
          event.endTime,
          qrDataUrl
        );
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
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function leaveEventAction(
  eventId: string
): Promise<ActionsResponse> {
  try {
    const { success, message, user } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null };

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found. It may have been deleted or cancelled.",
        data: null,
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
      };
    }

    // Prevent leaving after the event has started
    const now = new Date();
    if (now >= event.startTime) {
      return {
        success: false,
        message: "You cannot leave an event that has already started.",
        data: null,
      };
    }

    // Prevent leaving if the participant has paid for the event
    if (!event.isFree && participant.status === "paid") {
      return {
        success: false,
        message: "You cannot leave a paid event after completing payment.",
        data: null,
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
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function verifyTicket(
  code: string
): Promise<ActionsResponse<{ eventId: string }>> {
  try {
    const { success, message, user } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null };

    const ticket = await prisma.ticket.findUnique({
      where: {
        code,
      },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      return { success: false, message: "Ticket not found.", data: null };
    }

    if (ticket.event.organizerId !== user.id) {
      logWarning("Unauthorized ticket scan attempt", {
        userId: user.id,
        eventId: ticket.event.id,
      });
      return { success: false, message: "Unauthorized access.", data: null };
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
      };
    }

    if (now > endTime) {
      return {
        success: false,
        message: "Event has ended. Check-in is no longer available.",
        data: null,
      };
    }

    if (ticket.status !== "active") {
      return {
        success: false,
        message: "Ticket already used.",
        data: null,
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
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function getAllEventsForAdmin(): Promise<
  ActionsResponse<EventWithOrganizer[]>
> {
  try {
    const { user, message, success } = await getCurrentUserWithRole();

    if (!success || !user) return { success, message, data: null };

    // Restrict by role
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to view events.",
        data: null,
      };
    }

    const events = await prisma.event.findMany({
      include: {
        organizer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const plainEvents: EventWithOrganizer[] = events.map((event) => ({
      ...event,
      price: event.price?.toNumber() ?? 0,
    }));

    return { message: "ok", success: true, data: plainEvents };
  } catch (err) {
    return handlePrismaError(err);
  }
}
export async function getEventByAdmin(
  id: string
): Promise<ActionsResponse<SafeEvent>> {
  try {
    const { user, message, success } = await getCurrentUserWithRole();

    if (!success || !user) return { success, message, data: null };

    // Restrict by role
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to view event.",
        data: null,
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      return { message: "event not found", success: false, data: null };
    }

    return {
      message: "ok",
      success: true,
      data: { ...event, price: event.price?.toNumber() ?? 0 },
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function changeEventStatus(eventId: string, status: EventStatus) {
  try {
    const { success, user, message } = await getCurrentUserWithRole();
    if (!success || !user) return { success, message, data: null };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to change event status.",
        data: null,
      };
    }

    // Get the event with organizer info
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          include: {
            pushSubscriptions: true,
          },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found.",
        data: null,
      };
    }

    // Update event status with approval/rejection timestamp
    const updateData: any = { status };

    if (status === "approved") {
      updateData.approvedAt = new Date();
      updateData.approvedById = user.id;
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
    } else if (status === "cancelled") {
      updateData.cancelledAt = new Date();
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    // Prepare notification data based on status
    let notificationTitle = "";
    let notificationBody = "";
    let notificationType: NotificationType = "event_update";
    let actionUrl = "";

    if (status === "approved") {
      notificationTitle = "🎉 Event Approved!";
      notificationBody = `Great news! Your event "${event.title}" has been approved and is now live. People can start registering!`;
      notificationType = "event_accepted";
      actionUrl = `/events/${event.id}_${event.slug}`; // Redirect to the event page
    } else if (status === "rejected") {
      notificationTitle = "Event Review Update";
      notificationBody = `Unfortunately, your event "${event.title}" was not approved. Please review our guidelines or contact support for more information.`;
      notificationType = "event_update";
      actionUrl = `/events/create`; // Redirect to create page to try again
    } else if (status === "cancelled") {
      notificationTitle = "Event Cancelled";
      notificationBody = `Your event "${event.title}" has been cancelled.`;
      notificationType = "event_cancelled";
      actionUrl = `/events`; // Redirect to events list
    }

    // Create in-app notification in database
    await prisma.notification.create({
      data: {
        userId: event.organizerId,
        title: notificationTitle,
        message: notificationBody,
        type: notificationType,
        actionUrl: actionUrl,
      },
    });

    // Send push notification to all organizer's subscriptions
    if (event.organizer.pushSubscriptions.length > 0) {
      await sendPushNotifications(
        event.organizer.pushSubscriptions,
        notificationTitle,
        notificationBody,
        actionUrl
      );
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");

    return {
      success: true,
      message: "Event status updated",
      data: { ...updatedEvent, price: updatedEvent.price?.toNumber() ?? 0 },
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function deleteEventAction(eventId: string) {
  try {
    const { success, user, message } = await getCurrentUserWithRole();
    if (!success || !user) return { success, message, data: null };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to delete event.",
        data: null,
      };
    }

    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!currentEvent) {
      return { success: false, message: "Event not found.", data: null };
    }

    if (currentEvent.participants.length > 0) {
      return {
        success: false,
        message: "You can not delete an event that already has participants.",
        data: null,
      };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event Deleted successfully",
      data: null,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function deleteManyEventsAction(eventIds: string[]) {
  try {
    const { success, user, message } = await getCurrentUserWithRole();
    if (!success || !user) return { success, message, data: null };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to delete events.",
        data: null,
      };
    }

    // Find events that have participants
    const eventsWithParticipants = await prisma.event.findMany({
      where: {
        id: { in: eventIds },
        participants: { some: {} },
      },
      select: { id: true, title: true },
    });

    if (eventsWithParticipants.length > 0) {
      const blockedTitles = eventsWithParticipants
        .map((e) => e.title)
        .join(", ");
      return {
        success: false,
        message: `Cannot delete the following events (they have participants): ${blockedTitles}`,
        data: null,
      };
    }

    await prisma.event.deleteMany({
      where: { id: { in: eventIds } },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      message: `${eventIds.length} event(s) deleted successfully.`,
      data: null,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function subscribeToNotifications(
  subscription: any
): Promise<ActionsResponse> {
  try {
    const { success, message, user } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null };

    const { endpoint, keys } = subscription;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { keys, userId: user.id },
      create: { userId: user.id, endpoint, keys },
    });

    console.log("called, send notifications");

    return { message: "ok", success: true, data: null };
  } catch (err) {
    return handlePrismaError(err);
  }
}

async function sendPushNotifications(
  subscriptions: any[],
  title: string,
  body: string,
  url?: string
) {
  // Configure VAPID details
  webpush.setVapidDetails(
    "mailto:eminou756@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const payload = JSON.stringify({
    title,
    body,
    icon: "/icon512_maskable.png",
    badge: "/icon512_maskable.png",
    url: url || "/events",
  });

  // Send to all subscriptions
  const sendPromises = subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        payload
      );
      console.log(
        `✅ Push notification sent to ${subscription.endpoint.substring(
          0,
          50
        )}...`
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      // Remove invalid subscription
      await prisma.pushSubscription.delete({
        where: { endpoint: subscription.endpoint },
      });
    }
  });

  await Promise.allSettled(sendPromises);
}
