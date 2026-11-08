"use server";
import { requireAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { CommunityPostStatus } from "@prisma/client";

export async function getCommunityFeed() {
  try {
    const posts = await prisma.communityPost.findMany({
      where: {
        status: CommunityPostStatus.approved,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "ok",
      data: posts,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}

// Optional: Get user's own posts including pending ones
export async function getUserCommunityPosts(userId: string) {
  const auth = await requireAuthUser();
  if (!auth.user || auth.user.id !== userId)
    return { success: false, message: "Unauthorized", data: null, code: 403 };
  try {
    const posts = await prisma.communityPost.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "ok",
      data: posts,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
