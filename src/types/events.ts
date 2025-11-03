import { Event, EventStatus } from "@prisma/client";

import {
  ParticipantWithUser,
  ParticipantWithUserAndCount,
} from "./participants";
import { Organizer } from "./organizer";

export type SafeEvent = Omit<Event, "price"> & { price: number };

// Event with basic participants (no count)
export type EventWithParticipants = SafeEvent & {
  participants: ParticipantWithUser[];
};

// Event with participants that include attended event counts
export type EventWithParticipantsAndCounts = SafeEvent & {
  participants: ParticipantWithUserAndCount[];
  organizer: Organizer;
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
