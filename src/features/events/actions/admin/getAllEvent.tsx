"use server";
import prisma from "@/lib/db";

import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { ActionsResponse, EventWithOrganizer } from "@/types/index";

export async function getAllEvents(): Promise<
  ActionsResponse<EventWithOrganizer[]>
> {
  try {
    const { user, message, success, code } = await getUserRole();

    if (!success || !user) return { success, message, data: null, code };

    // Restrict by role
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to view events.",
        data: null,
        code: 403,
        errorType: "FORBIDDEN",
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

    return { message: "ok", success: true, data: events, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
