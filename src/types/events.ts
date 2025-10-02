import { Event, TimelineItem } from "@prisma/client";

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
};

// Event with participants (with counts) and timeline items
export type EventWithParticipantsAndTimeLineItems = EventWithParticipantsAndCounts & {
  timelineItems: TimelineItem[];
  organizer: Organizer;
};
