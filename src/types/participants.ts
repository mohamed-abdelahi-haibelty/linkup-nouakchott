import { Event, Participant, User } from "@prisma/client";

// A "Participant" with its related "User"
export type ParticipantWithUser = Participant & {
  participant: User;
};

// Add attendedEventsCount to the participant type
export type ParticipantWithUserAndCount = ParticipantWithUser & {
  attendedEventsCount: number;
};
