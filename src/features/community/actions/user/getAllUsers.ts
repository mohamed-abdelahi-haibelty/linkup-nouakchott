"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";

export async function getAllUsers() {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, data: null, code };

    // Only admins can view all users
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to view users.",
        data: null,
        code: 403,
      };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
            posts: true,
            registrations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Users fetched successfully",
      data: users,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
