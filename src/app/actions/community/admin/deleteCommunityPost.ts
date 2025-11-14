"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserRole } from "../../user/getUserRole";

export async function deleteCommunityPost(postId: string) {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    if (user.role !== "admin" && user.role !== "moderator") {
      return {
        success: false,
        message: "You are not authorized to delete community posts.",
        data: null,
        code: 403,
      };
    }

    const currentPost = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      return {
        success: false,
        message: "Community post not found.",
        data: null,
        code: 404,
      };
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/community");
    revalidatePath("/community");

    return {
      success: true,
      message: "Community post deleted successfully",
      data: null,
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
