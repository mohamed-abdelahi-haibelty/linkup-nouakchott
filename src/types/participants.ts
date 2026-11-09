import { Participant, User } from "@prisma/client";

// A "Participant" with its related "User"
export type ParticipantWithUser = Participant & {
  participant: User;
};

// Add attendedEventsCount to the participant type
export type PublicParticipant = Participant & {
  participant: Pick<User, "id" | "name" | "avatarUrl">;
};

export type ParticipantWithUserAndCount = PublicParticipant & {
  attendedEventsCount: number;
};
