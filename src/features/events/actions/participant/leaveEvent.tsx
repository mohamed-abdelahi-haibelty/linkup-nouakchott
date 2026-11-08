"use server";
import { unregisterParticipant } from "@/features/events/server/registration";
import { requireAuthUser } from "@/lib/auth";
import { handlePrismaError } from "@/server/errors";
import type { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function leaveEvent(eventId: string): Promise<ActionsResponse> {
  const auth = await requireAuthUser();
  if (!auth.success || !auth.user)
    return {
      success: false,
      message: auth.message,
      code: auth.code,
      data: null,
    };
  try {
    const event = await unregisterParticipant(eventId, auth.user.id);
    revalidatePath(`/events/${event.id}_${event.slug}`);
    revalidatePath("/manage");
    return {
      success: true,
      message: "You have left the event.",
      data: null,
      code: 200,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
