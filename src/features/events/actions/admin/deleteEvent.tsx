"use server";
import prisma from "@/lib/db";

import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { revalidatePath } from "next/cache";

export async function deleteEvent(eventId: string) {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to delete event.",
        data: null,
        code: 403,
      };
    }

    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!currentEvent) {
      return {
        success: false,
        message: "Event not found.",
        data: null,
        code: 404,
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
      where: { id: eventId },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event Deleted successfully",
      data: null,
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
