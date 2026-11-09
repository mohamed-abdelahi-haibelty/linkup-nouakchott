"use server";
import { getAppSession } from "@/lib/app-session";

export async function requireAuthUser() {
  const { getUser, isAuthenticated } = getAppSession();

  if (!(await isAuthenticated())) {
    return {
      success: false,
      message: "Unauthorized user",
      user: null,
      code: 401,
    };
  }

  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "User session not found",
      user: null,
      code: 401,
    };
  }

  return { success: true, message: "ok", user, code: 200 };
}
