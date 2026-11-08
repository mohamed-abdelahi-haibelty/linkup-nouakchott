"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function removeFromFavorites(favoriteId: string) {
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

    // Check if favorite exists and belongs to user
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      return {
        success: false,
        message: "Favorite not found.",
        data: null,
        code: 404,
      };
    }

    if (favorite.userId !== kindeUser.id) {
      return {
        success: false,
        message: "You are not authorized to remove this favorite.",
        data: null,
        code: 403,
      };
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    });

    revalidatePath("/manage");
    revalidatePath("/events");
    revalidatePath("/community");

    return {
      success: true,
      message: "Removed from favorites",
      data: null,
      code: 204,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
