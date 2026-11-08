"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { ActionsResponse } from "@/types/index";
import { FavoriteType } from "@prisma/client";

export async function toggleFavorite(
  targetId: string,
  type: FavoriteType,
): Promise<ActionsResponse> {
  const { success, user, message, code } = await requireAuthUser();

  if (!success || !user) return { success, message, data: null, code };

  try {
    const existing = await prisma.favorite.findUnique({
      where:
        type === "event"
          ? { userId_eventId: { userId: user.id, eventId: targetId } }
          : { userId_postId: { userId: user.id, postId: targetId } },
    });

    if (existing) {
      await prisma.favorite.delete({
        where:
          type === "event"
            ? { userId_eventId: { userId: user.id, eventId: targetId } }
            : { userId_postId: { userId: user.id, postId: targetId } },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          eventId: type === "event" ? targetId : null,
          postId: type === "post" ? targetId : null,
          type,
        },
      });
    }

    return { success: true, message: "ok", data: null, code: 200 };
  } catch (err) {
    return handlePrismaError(err);
  }
}
