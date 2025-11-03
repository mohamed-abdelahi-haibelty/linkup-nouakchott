"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { logError, logWarning } from "./sentry";
import prisma from "@/lib/db";

export async function requireAuthUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    logWarning("Unauthorized user tried to perform an action");
    return { success: false, message: "Unauthorized user", user: null };
  }

  const user = await getUser();

  if (!user) {
    logWarning("User session not found");
    return { success: false, message: "User session not found", user: null };
  }

  return { success: true, message: "ok", user };
}

export async function getCurrentUserWithRole() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  try {
    if (!(await isAuthenticated())) {
      return { success: false, message: "Unauthorized user", user: null };
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return { success: false, message: "User session not found", user: null };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      select: { id: true, name: true, role: true, email: true },
    });

    if (!dbUser) {
      return { success: false, message: "User not found", user: null };
    }

    return { success: true, message: "ok", user: dbUser };
  } catch (err) {
    logError(err);
    return {
      success: false,
      message: "Failed to authenticate user",
      user: null,
    };
  }
}
