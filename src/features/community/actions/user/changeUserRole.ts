"use server";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRole: UserRole) {
  try {
    const { success, user, message, code } = await getUserRole();
    if (!success || !user) return { success, message, code };

    // Only admins can change user roles
    if (user.role !== "admin") {
      return {
        success: false,
        message: "You are not authorized to change user roles.",
        code: 403,
      };
    }

    // Prevent admins from changing their own role
    if (user.id === userId) {
      return {
        success: false,
        message: "You cannot change your own role.",
        code: 400,
      };
    }

    // Check if the user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "User not found.",
        code: 404,
      };
    }

    // Update the user's role
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: `User role updated to ${newRole} successfully.`,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
