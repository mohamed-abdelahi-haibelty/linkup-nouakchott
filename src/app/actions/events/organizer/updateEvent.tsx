"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { generateSlug, handlePrismaError } from "@/lib/utils";
import { EventFormInput, eventFormSchema } from "@/lib/validation/event";
import { ActionsResponse, SafeEvent } from "@/types";
import { revalidatePath } from "next/cache";

type UpdatedEventData = {
  event: SafeEvent;
  requiresReapproval: boolean;
};

export async function updateEvent(
  eventId: string,
  data: EventFormInput
): Promise<ActionsResponse<UpdatedEventData>> {
  const { success, message, user, code } = await requireAuthUser();
  if (!success || !user) return { success, message, data: null, code };

  const parsed = eventFormSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      code: 400,
    };
  }

  try {
    const existing = await prisma.event.findUnique({
      where: { id: eventId, organizerId: user.id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        status: true,
        slug: true,
        startTime: true,
      },
    });

    if (!existing) {
      return {
        success: false,
        message: "Event not found",
        data: null,
        code: 404,
      };
    }

    if (existing.status === "cancelled") {
      return {
        success: false,
        message: "This event has been cancelled and cannot be edited.",
        code: 409,
      };
    }

    if (new Date(existing.startTime) <= new Date()) {
      return {
        success: false,
        message: "Cannot edit an event that has already started.",
        code: 409,
      };
    }

    const participantCount = await prisma.participant.count({
      where: { eventId: existing.id },
    });

    if (participantCount > 0) {
      return {
        success: false,
        message:
          "Cannot edit this event because participants have already registered.",
        code: 409,
      };
    }

    // Detect major changes that require reapproval
    const requiresReapproval =
      existing.title !== parsed.data.title ||
      existing.description !== parsed.data.description ||
      existing.imageUrl !== parsed.data.imageUrl;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...parsed.data,
        price: parsed.data.price ?? 0,
        status: requiresReapproval ? "pending" : existing.status,
        approvedById: requiresReapproval ? null : undefined,
        approvedAt: requiresReapproval ? null : undefined,
        slug:
          existing.title !== parsed.data.title
            ? generateSlug(parsed.data.title)
            : existing.slug,
      },
    });

    revalidatePath(`/events/${updatedEvent.id}_${updatedEvent.slug}`);
    revalidatePath("/events");

    return {
      success: true,
      message: requiresReapproval
        ? "Event updated successfully. It will need to be re-approved."
        : "Event updated successfully.",
      data: {
        event: { ...updatedEvent, price: updatedEvent.price ?? 0 },
        requiresReapproval,
      },
      code: 200,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
