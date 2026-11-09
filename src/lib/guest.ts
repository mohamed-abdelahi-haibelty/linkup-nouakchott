import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "@/lib/db";

export const GUEST_COOKIE = "linkup_guest";
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const getGuest = cache(async () => {
  const token = (await cookies()).get(GUEST_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await prisma.guestSession.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return {
    id: session.userId,
    given_name: "Guest",
    family_name: "",
    email: null,
    picture: null,
  };
});
