"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function deleteUserCommunityPost(postId: string) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();

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

    // Check if post exists and belongs to user
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found.",
        data: null,
        code: 404,
      };
    }

    if (post.userId !== kindeUser.id) {
      return {
        success: false,
        message: "You are not authorized to delete this post.",
        data: null,
        code: 403,
      };
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    revalidatePath("/manage");
    revalidatePath("/community");

    return {
      success: true,
      message: "Post deleted successfully",
      data: null,
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
