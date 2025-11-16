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

    let trimmedPhone = phoneNumber.trim();

    // Remove all non-digit characters except + at the start
    trimmedPhone = trimmedPhone.replace(/[^\d+]/g, "");

    // Validate that we have a phone number
    if (trimmedPhone.length < 8) {
      return {
        success: false,
        message: "Please enter a valid phone number.",
        data: null,
        code: 400,
      };
    }

    // Phone number must start with + (country code is required)
    if (!trimmedPhone.startsWith("+")) {
      return {
        success: false,
        message:
          "Please include country code (e.g., +222 for Mauritania, +212 for Morocco, +1 for USA).",
        data: null,
        code: 400,
      };
    }

    // Final validation - must start with + and have at least 10 digits total
    const phoneRegex = /^\+\d{10,}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      return {
        success: false,
        message: "Please enter a valid phone number with country code.",
        data: null,
        code: 400,
      };
    }

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
