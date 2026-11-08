"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";
import { ActionsResponse } from "@/types/index";

import { Notification } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getNotifications(
  limit: number = 20,
): Promise<ActionsResponse<Notification[]>> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, message: "ok", data: notifications, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<ActionsResponse<Notification>> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId, userId: user.id },
      data: { readAt: new Date() },
    });

    revalidatePath("/notification");

    return { success: true, message: "ok", data: notification, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function markAllNotificationsAsRead(): Promise<
  ActionsResponse<number>
> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  try {
    const result = await prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });

    revalidatePath("/notification");

    return {
      success: true,
      message: "ok",
      data: result.count,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function deleteNotification(
  notificationId: string,
): Promise<ActionsResponse<Notification>> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  try {
    const notification = await prisma.notification.delete({
      where: { id: notificationId, userId: user.id },
    });

    revalidatePath("/notification");

    return { success: true, message: "ok", data: notification, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
