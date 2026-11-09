import { Event, EventStatus } from "@prisma/client";

import { Organizer } from "./organizer";
import { ParticipantWithUserAndCount, PublicParticipant } from "./participants";

export type SafeEvent = Omit<Event, "price"> & { price: number };

// Event with basic participants (no count)
export type EventWithParticipants = SafeEvent & {
  participants: PublicParticipant[];
};

// Event with participants that include attended event counts
export type EventWithParticipantsAndCounts = SafeEvent & {
  participants: ParticipantWithUserAndCount[];
  organizer: Organizer;
};

export type EventWithParticipantsCount = SafeEvent & {
  participantsCount: number;
};

export type EventWithOrganizer = SafeEvent & {
  organizer: Omit<Organizer, "hostedEventsCount">;
};

export interface EventTicketProps {
  title: string;
  startTime: Date;
  endTime: Date;
  qrUrl: string;
}

export type PendingEvent = {
  id: string;
  title: string;
  organizer: string;
  status: EventStatus;
};
