"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getAppSession } from "@/lib/app-session";

export async function getUserFavorites() {
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

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: kindeUser.id,
      },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                participants: true,
              },
            },
          },
        },
        post: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Separate events and posts
    const favoriteEvents = favorites
      .filter((fav) => fav.type === "event" && fav.event)
      .map((fav) => ({
        favoriteId: fav.id,
        ...fav.event!,
      }));

    const favoritePosts = favorites
      .filter((fav) => fav.type === "post" && fav.post)
      .map((fav) => ({
        favoriteId: fav.id,
        ...fav.post!,
      }));

    return {
      success: true,
      message: "Favorites fetched successfully",
      data: {
        events: favoriteEvents,
        posts: favoritePosts,
      },
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
