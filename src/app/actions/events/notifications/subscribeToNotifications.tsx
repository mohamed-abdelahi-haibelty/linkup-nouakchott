"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { ActionsResponse } from "@/types";

export async function subscribeToNotifications(
  subscription: any
): Promise<ActionsResponse> {
  try {
    const { success, message, user, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    const { endpoint, keys } = subscription;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { keys, userId: user.id },
      create: { userId: user.id, endpoint, keys },
    });

    console.log("called, send notifications");

    return { message: "ok", success: true, data: null, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
