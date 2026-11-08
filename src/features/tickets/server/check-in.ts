import { ActionError } from "@/server/errors";
import { serializable } from "@/server/transaction";
import "server-only";

/** Both scanner entry points use the same ownership and one-use checks. */
export async function checkInTicket(
  code: string,
  organizerId: string,
  eventId?: string,
) {
  return serializable(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { code },
      include: { event: true },
    });
    if (!ticket) throw new ActionError("Ticket not found", 404);
    if (eventId && ticket.eventId !== eventId)
      throw new ActionError("This ticket is for a different event", 400);
    if (ticket.event.organizerId !== organizerId)
      throw new ActionError(
        "You cannot check in attendees for this event",
        403,
      );
    if (ticket.event.status !== "approved" || ticket.event.deletedAt)
      throw new ActionError("Check-in is unavailable for this event");
    const now = new Date();
    const opensAt = new Date(
      ticket.event.startTime.getTime() - 2 * 60 * 60 * 1000,
    );
    if (now < opensAt)
      throw new ActionError("Check-in opens two hours before the event");
    if (now > ticket.event.endTime)
      throw new ActionError("This event has ended");
    const claimed = await tx.ticket.updateMany({
      where: { id: ticket.id, status: "active" },
      data: { status: "used", scannedBy: organizerId },
    });
    if (claimed.count !== 1)
      throw new ActionError("Ticket has already been used or cancelled");
    await tx.participant.updateMany({
      where: {
        eventId: ticket.eventId,
        participantId: ticket.userId,
        status: { not: "cancelled" },
      },
      data: { checkedInAt: now },
    });
    return { eventId: ticket.eventId };
  });
}
