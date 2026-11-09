"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { revalidatePath } from "next/cache";

export async function deleteManyEvents(eventIds: string[]) {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to delete events.",
        data: null,
        code: 403,
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
        code: 409,
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
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
