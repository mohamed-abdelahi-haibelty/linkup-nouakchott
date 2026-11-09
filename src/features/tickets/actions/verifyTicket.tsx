"use server";
import { checkInTicket } from "@/features/tickets/server/check-in";
import { requireAuthUser } from "@/lib/auth";
import { handlePrismaError } from "@/server/errors";
import type { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function verifyTicket(
  code: string,
  eventId?: string,
): Promise<ActionsResponse<{ eventId: string }>> {
  const auth = await requireAuthUser();
  if (!auth.success || !auth.user)
    return {
      success: false,
      message: auth.message,
      code: auth.code,
      data: null,
    };
  if (typeof code !== "string" || !code.trim() || code.length > 100)
    return {
      success: false,
      message: "Invalid ticket code",
      code: 400,
      data: null,
    };
  try {
    const data = await checkInTicket(code.trim(), auth.user.id, eventId);
    revalidatePath(`/manage/event/${data.eventId}/participants`);
    return { success: true, message: "Ticket verified", code: 200, data };
  } catch (error) {
    return handlePrismaError(error);
  }
}
