"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getAppSession } from "@/lib/app-session";

export async function getUserCommunityPosts() {
  try {
    const { getUser, isAuthenticated } = getAppSession();

    if (!(await isAuthenticated())) {
      return {
        success: false,
        message: "Unauthorized user",
        data: null,
        code: 401,
      };
    }

    const kindeUser = await getUser();
    if (!kindeUser?.id) {
      return {
        success: false,
        message: "User session not found",
        data: null,
        code: 401,
      };
    }

    const posts = await prisma.communityPost.findMany({
      where: {
        userId: kindeUser.id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      message: "Posts fetched successfully",
      data: posts,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
