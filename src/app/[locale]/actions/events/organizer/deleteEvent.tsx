"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function deleteEvent(eventId: string): Promise<ActionsResponse> {
  const { success, message, user, code } = await requireAuthUser();
  if (!success || !user) return { success, message, data: null, code };

  try {
    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId, organizerId: user.id },
      include: { participants: true },
    });

    if (!currentEvent) {
      return {
        success: false,
        message: "Event not found.",
        data: null,
        code: 4004,
      };
    }

    if (currentEvent.participants.length > 0) {
      return {
        success: false,
        message: "You can not delete an event that already has participants.",
        data: null,
        code: 409,
      };
    }

    await prisma.event.delete({
      where: {
        id: eventId,
        organizerId: user.id,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/manage");

    return {
      success: true,
      message: "Event deleted successfully.",
      data: null,
      code: 204,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
