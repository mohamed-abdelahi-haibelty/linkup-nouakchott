"use server";
import { verifyTicket } from "@/features/tickets/actions/verifyTicket";

export async function verifyEventTicket(code: string, eventId: string) {
  if (typeof eventId !== "string" || !eventId.trim())
    return {
      success: false,
      message: "Event is required",
      code: 400,
      data: null,
    };
  return verifyTicket(code, eventId);
}
