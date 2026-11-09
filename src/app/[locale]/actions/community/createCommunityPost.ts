// app/actions/community/createCommunityPost.ts
"use server";
import prisma from "@/lib/db";
import {
  CommunityPostFormInput,
  communityPostSchema,
} from "@/lib/validation/communityPost";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/sentry";
import { getAppSession } from "@/lib/app-session";
import { CommunityPostStatus, Prisma } from "@prisma/client";
import { getUserRole } from "../user/getUserRole";

export async function createCommunityPost(data: CommunityPostFormInput) {
  const { success, message, user } = await getUserRole();

  if (!success || !user) return { success, message, data: null };

  const parsed = communityPostSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  let status: CommunityPostStatus = CommunityPostStatus.pending;
  let successMessage =
    "Community post created successfully! It will be visible after admin approval.";

  if (user.role === "admin" || user.role === "moderator") {
    status = CommunityPostStatus.approved;
    successMessage = "Community post created successfully!";
  }

  try {
    if (user.id.startsWith("guest_")) return { success: false, message: "Please sign in to publish content.", data: null, code: 403 };
    const post = await prisma.communityPost.create({
      data: {
        ...parsed.data,
        userId: user.id,
        status: status,
      },
    });

    revalidatePath("/community");
    return {
      success: true,
      data: post,
      message:
        "Community post created successfully! It will be visible after admin approval.",
      code: 200,
    };
  } catch (e) {
    logError(e, {
      data,
      userId: (await getAppSession().getUser())?.id,
    });

    // Handle Prisma errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          success: false,
          message: "A similar post already exists.",
          errorCode: "DUPLICATE_ENTRY",
        };
      }

      if (e.code === "P2003") {
        return {
          success: false,
          message: "Invalid reference data. Please check your inputs.",
          errorCode: "FK_CONSTRAINT",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create post. Please try again later.",
      errorCode: "UNEXPECTED_ERROR",
      code: 500,
    };
  }
}
