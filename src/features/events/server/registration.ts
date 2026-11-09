import { ActionError } from "@/server/errors";
import { serializable } from "@/server/transaction";
import { Prisma } from "@prisma/client";
import "server-only";

/** Lock the event before checking capacity; registration and ticket commit together. */
export async function registerParticipant(
  eventId: string,
  userId: string,
  ticketCode: string,
) {
  return serializable(async (tx) => {
    await tx.$queryRaw(
      Prisma.sql`SELECT id FROM events WHERE id = ${eventId} FOR UPDATE`,
    );
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event || event.deletedAt)
      throw new ActionError("Event not found", 404);
    if (event.status !== "approved")
      throw new ActionError("Registration is not available for this event");
    if (event.organizerId === userId)
      throw new ActionError("Organizers cannot register for their own event");
    const now = new Date();
    if (now >= event.registrationDeadline || now >= event.startTime)
      throw new ActionError("Registration has closed");
    const existing = await tx.participant.findUnique({
      where: { participantId_eventId: { participantId: userId, eventId } },
    });
    if (existing)
      throw new ActionError("You are already registered for this event");
    const count = await tx.participant.count({
      where: { eventId, status: { not: "cancelled" } },
    });
    if (count >= event.capacity) throw new ActionError("Event is full");
    const participant = await tx.participant.create({
      data: {
        participantId: userId,
        eventId,
        status: "confirmed",
        confirmedAt: now,
      },
    });
    await tx.ticket.create({ data: { eventId, userId, code: ticketCode } });
    return { participant, event };
  });
}

export async function unregisterParticipant(eventId: string, userId: string) {
  return serializable(async (tx) => {
    await tx.$queryRaw(
      Prisma.sql`SELECT id FROM events WHERE id = ${eventId} FOR UPDATE`,
    );
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ActionError("Event not found", 404);
    if (new Date() >= event.startTime)
      throw new ActionError("You cannot leave an event that has started");
    const participant = await tx.participant.findUnique({
      where: { participantId_eventId: { participantId: userId, eventId } },
    });
    if (!participant)
      throw new ActionError("You are not registered for this event", 404);
    const ticket = await tx.ticket.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (ticket?.status === "used")
      throw new ActionError("You have already checked in");
    await tx.ticket.deleteMany({ where: { eventId, userId } });
    await tx.participant.delete({
      where: { participantId_eventId: { participantId: userId, eventId } },
    });
    return event;
  });
}
