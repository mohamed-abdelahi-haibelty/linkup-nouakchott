"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";

export async function getCommunityPost(postId: string) {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    if (user.role !== "admin" && user.role !== "moderator") {
      return {
        success: false,
        message: "You are not authorized to view this post.",
        data: null,
        code: 403,
      };
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            phoneNumber: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
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
        message: "Community post not found.",
        data: null,
        code: 404,
      };
    }

    return {
      success: true,
      message: "Community post fetched successfully",
      data: post,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
