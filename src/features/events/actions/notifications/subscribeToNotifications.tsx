"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";
import { z } from "zod";

import { ActionsResponse } from "@/types/index";

export async function subscribeToNotifications(
  subscription: unknown,
): Promise<ActionsResponse> {
  try {
    const { success, message, user, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    const parsed = z
      .object({
        endpoint: z.url().refine((value) => value.startsWith("https://")),
        keys: z.object({ auth: z.string().min(1), p256dh: z.string().min(1) }),
      })
      .safeParse(subscription);
    if (!parsed.success)
      return {
        success: false,
        message: "Invalid push subscription",
        code: 400,
        data: null,
      };
    const { endpoint, keys } = parsed.data;

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { keys, userId: user.id },
      create: { userId: user.id, endpoint, keys },
    });

    return { message: "ok", success: true, data: null, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
