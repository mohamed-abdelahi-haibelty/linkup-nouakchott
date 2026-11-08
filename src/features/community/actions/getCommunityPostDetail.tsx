"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

export async function getCommunityPostDetail(postId: string) {
  try {
    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
        status: "approved",
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
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
        data: null,
        code: 404,
      };
    }

    return {
      success: true,
      message: "ok",
      data: post,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
