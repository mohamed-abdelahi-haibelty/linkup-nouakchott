"use server";
import { getAppSession } from "@/lib/app-session";

import prisma from "@/lib/db";
import { logError } from "@/lib/sentry";

export async function getUserRole() {
  const { getUser, isAuthenticated } = getAppSession();

  try {
    if (!(await isAuthenticated())) {
      return {
        success: false,
        message: "Unauthorized user",
        user: null,
        code: 401,
      };
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return {
        success: false,
        message: "User session not found",
        user: null,
        code: 401,
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!dbUser) {
      return {
        success: false,
        message: "User not found",
        user: null,
        code: 404,
      };
    }

    return { success: true, message: "ok", user: dbUser, code: 200 };
  } catch (err) {
    logError(err);
    return {
      success: false,
      message: "Failed to authenticate user",
      user: null,
      code: 500,
    };
  }
}
