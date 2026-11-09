"use server";
import { registerParticipant } from "@/features/events/server/registration";
import {
  createTicketCode,
  ticketQrDataUrl,
} from "@/features/tickets/server/qr";
import { requireAuthUser } from "@/lib/auth";
import { logError } from "@/lib/sentry";
import { sendTicketEmail } from "@/server/email";
import { handlePrismaError } from "@/server/errors";
import type { ActionsResponse } from "@/types";
import type { Participant } from "@prisma/client";
import { revalidatePath } from "next/cache";

type RegistrationResult = { participant: Participant; qrDataUrl: string };

export async function joinEvent(
  eventId: string,
): Promise<ActionsResponse<RegistrationResult>> {
  const auth = await requireAuthUser();
  if (!auth.success || !auth.user)
    return {
      success: false,
      message: auth.message,
      code: auth.code,
      data: null,
    };
  try {
    const ticketCode = createTicketCode();
    const qrDataUrl = await ticketQrDataUrl(ticketCode);
    const { participant, event } = await registerParticipant(
      eventId,
      auth.user.id,
      ticketCode,
    );
    // Delivery is best-effort: a mail outage must not undo a committed registration.
    if (auth.user.email) {
      try {
        await sendTicketEmail(
          auth.user.email,
          event.title,
          event.startTime,
          event.endTime,
          qrDataUrl,
        );
      } catch (error) {
        logError(error, { operation: "ticket-email" });
      }
    }
    revalidatePath(`/events/${event.id}_${event.slug}`);
    revalidatePath("/manage");
    return {
      success: true,
      message: "Registration confirmed. Your ticket is ready.",
      data: { participant, qrDataUrl },
      code: 201,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
