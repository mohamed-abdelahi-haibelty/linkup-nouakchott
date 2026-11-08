import type { Prisma } from "@prisma/client";
import "server-only";
export const publicUserSelect = {
  id: true,
  name: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;
