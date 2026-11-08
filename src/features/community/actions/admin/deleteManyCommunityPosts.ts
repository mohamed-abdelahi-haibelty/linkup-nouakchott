"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { revalidatePath } from "next/cache";

export async function deleteManyCommunityPosts(postIds: string[]) {
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

    await prisma.communityPost.deleteMany({
      where: { id: { in: postIds } },
    });

    revalidatePath("/admin/community");
    revalidatePath("/community");

    return {
      success: true,
      message: `${postIds.length} community post(s) deleted successfully.`,
      data: null,
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
