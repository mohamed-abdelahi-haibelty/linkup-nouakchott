import { User } from "@prisma/client";

export type Organizer = User & {
  hostedEventsCount: number;
};
