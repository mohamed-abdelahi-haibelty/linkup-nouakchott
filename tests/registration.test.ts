import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/lib/sentry", () => ({ logError: vi.fn() }));
vi.mock("@/lib/db", () => ({ default: { $transaction: vi.fn() } }));
import db from "@/lib/db";
import {
  registerParticipant,
  unregisterParticipant,
} from "@/features/events/server/registration";
import { checkInTicket } from "@/features/tickets/server/check-in";
import { eventFormSchema } from "@/features/events/schemas/event";

const future = (minutes: number) => new Date(Date.now() + minutes * 60000);
const event = () => ({
  id: "event-a",
  organizerId: "organizer-a",
  deletedAt: null,
  status: "approved",
  capacity: 2,
  registrationDeadline: future(30),
  startTime: future(60),
  endTime: future(120),
});
const tx = {
  $queryRaw: vi.fn(),
  event: { findUnique: vi.fn() },
  participant: {
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    updateMany: vi.fn(),
  },
  ticket: {
    create: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};
beforeEach(() => {
  vi.mocked(db.$transaction).mockImplementation(async (callback: unknown) =>
    (callback as (tx: unknown) => Promise<unknown>)(tx),
  );
  tx.event.findUnique.mockResolvedValue(event());
  tx.participant.findUnique.mockResolvedValue(null);
  tx.participant.count.mockResolvedValue(1);
  tx.participant.create.mockImplementation(async ({ data }) => ({
    id: "participant-a",
    ...data,
  }));
  tx.ticket.findUnique.mockResolvedValue({
    id: "ticket-a",
    eventId: "event-a",
    userId: "user-a",
    event: event(),
  });
  tx.ticket.updateMany.mockResolvedValue({ count: 1 });
});

describe("free registration", () => {
  it("confirms registration and issues a ticket inside a serializable transaction", async () => {
    const result = await registerParticipant(
      "event-a",
      "user-a",
      "ticket-code",
    );
    expect(result.participant.status).toBe("confirmed");
    expect(tx.ticket.create).toHaveBeenCalledWith({
      data: { eventId: "event-a", userId: "user-a", code: "ticket-code" },
    });
    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: "Serializable",
    });
    expect(tx.$queryRaw).toHaveBeenCalled();
  });
  it("does not create a participant or a ticket when the event is full", async () => {
    tx.participant.count.mockResolvedValue(2);
    await expect(
      registerParticipant("event-a", "user-a", "ticket-code"),
    ).rejects.toThrow("Event is full");
    expect(tx.participant.create).not.toHaveBeenCalled();
    expect(tx.ticket.create).not.toHaveBeenCalled();
  });
  it.each(["cancelled", "pending", "rejected", "demo"])(
    "rejects registration for a %s event",
    async (status) => {
      tx.event.findUnique.mockResolvedValue({ ...event(), status });
      await expect(
        registerParticipant("event-a", "user-a", "ticket-code"),
      ).rejects.toThrow("Registration is not available");
      expect(tx.ticket.create).not.toHaveBeenCalled();
    },
  );
  it("rejects duplicate registrations without issuing another ticket", async () => {
    tx.participant.findUnique.mockResolvedValue({ id: "existing" });
    await expect(
      registerParticipant("event-a", "user-a", "ticket-code"),
    ).rejects.toThrow("already registered");
    expect(tx.ticket.create).not.toHaveBeenCalled();
  });
  it("rejects organizers registering for their own event", async () => {
    await expect(
      registerParticipant("event-a", "organizer-a", "ticket-code"),
    ).rejects.toThrow("Organizers cannot register");
  });
  it("rejects expired registration deadlines", async () => {
    tx.event.findUnique.mockResolvedValue({
      ...event(),
      registrationDeadline: future(-1),
    });
    await expect(
      registerParticipant("event-a", "user-a", "ticket-code"),
    ).rejects.toThrow("Registration has closed");
  });
});

describe("ticket check-in", () => {
  it("rejects an organizer who does not own the event", async () => {
    await expect(checkInTicket("code", "another-organizer")).rejects.toThrow(
      "cannot check in",
    );
    expect(tx.ticket.updateMany).not.toHaveBeenCalled();
  });
  it("rejects tickets scanned for a different event", async () => {
    await expect(
      checkInTicket("code", "organizer-a", "another-event"),
    ).rejects.toThrow("different event");
  });
  it("atomically claims an active ticket and records attendance", async () => {
    expect(await checkInTicket("code", "organizer-a")).toEqual({
      eventId: "event-a",
    });
    expect(tx.ticket.updateMany).toHaveBeenCalledWith({
      where: { id: "ticket-a", status: "active" },
      data: { status: "used", scannedBy: "organizer-a" },
    });
    expect(tx.participant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { checkedInAt: expect.any(Date) } }),
    );
  });
  it("does not record attendance if another request already used the ticket", async () => {
    tx.ticket.updateMany.mockResolvedValue({ count: 0 });
    await expect(checkInTicket("code", "organizer-a")).rejects.toThrow(
      "already been used",
    );
    expect(tx.participant.updateMany).not.toHaveBeenCalled();
  });
  it("does not let a checked-in attendee unregister", async () => {
    tx.participant.findUnique.mockResolvedValue({ id: "participant-a" });
    tx.ticket.findUnique.mockResolvedValue({ status: "used" });
    await expect(unregisterParticipant("event-a", "user-a")).rejects.toThrow(
      "already checked in",
    );
    expect(tx.participant.delete).not.toHaveBeenCalled();
  });
});

describe("event form boundaries", () => {
  const input = () => ({
    title: "Community meetup",
    description: "An event for the local community.",
    imageUrl: "https://example.com/event.png",
    capacity: 10,
    location: "Nouakchott",
    startTime: future(60),
    endTime: future(120),
    registrationDeadline: future(30),
    contactPhone: "+22212345678",
  });
  it("does not accept paid-event fields into the parsed payload", () => {
    const result = eventFormSchema.parse({
      ...input(),
      price: 500,
      isFree: false,
    });
    expect(result).not.toHaveProperty("price");
    expect(result).not.toHaveProperty("isFree");
  });
  it("rejects fractional capacity and registration after the event starts", () => {
    expect(
      eventFormSchema.safeParse({ ...input(), capacity: 1.5 }).success,
    ).toBe(false);
    expect(
      eventFormSchema.safeParse({
        ...input(),
        registrationDeadline: future(90),
      }).success,
    ).toBe(false);
  });
});
