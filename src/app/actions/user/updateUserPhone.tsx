"use server";

import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import { ActionsResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { handlePrismaError } from "@/lib/utils";

type Response = {
  id: string;
  phoneNumber: string | null;
};

export async function updateUserPhone(
  phoneNumber: string
): Promise<ActionsResponse<Response>> {
  try {
    const { success, message, user, code } = await requireAuthUser();

    if (!success || !user) return { success, message, data: null, code };

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\d\s+()-]{8,}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return {
        success: false,
        message: "Please enter a valid phone number.",
        data: null,
        code: 400,
      };
    }

    const trimmedPhone = phoneNumber.trim();

    // Update user phone number
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { phoneNumber: trimmedPhone },
      select: {
        id: true,
        phoneNumber: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message: "Phone number updated successfully.",
      data: updatedUser,
      code: 200,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
