"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse, SafeEvent } from "@/types";
import { getUserRole } from "../../user/getUserRole";

export async function getEvent(
  id: string
): Promise<ActionsResponse<SafeEvent>> {
  try {
    const { user, message, success, code } = await getUserRole();

    if (!success || !user) return { success, message, data: null, code };

    // Restrict by role
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to view event.",
        data: null,
        code: 403,
        errorType: "FORBIDDEN",
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      return {
        message: "event not found",
        success: false,
        data: null,
        code: 404,
        errorType: "NOT_FOUND",
      };
    }

    return {
      message: "ok",
      success: true,
      data: event,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
