"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { getUserRole } from "../../user/getUserRole";

export async function getAllCommunityPosts() {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    if (user.role !== "admin" && user.role !== "moderator") {
      return {
        success: false,
        message: "You are not authorized to view community posts.",
        data: null,
        code: 403,
      };
    }

    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Community posts fetched successfully",
      data: posts,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
