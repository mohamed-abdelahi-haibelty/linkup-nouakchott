// app/actions/community/createCommunityPost.ts
"use server";
import prisma from "@/lib/db";
import { requireAuthUser } from "@/lib/auth";
import {
  CommunityPostFormInput,
  communityPostSchema,
} from "@/lib/validation/communityPost";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/sentry";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";

export async function createCommunityPost(data: CommunityPostFormInput) {
  const { success, message, user } = await requireAuthUser();

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

  try {
    const post = await prisma.communityPost.create({
      data: {
        ...parsed.data,
        userId: user.id,
        status: "pending", // Post needs admin approval
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
      userId: (await getKindeServerSession().getUser())?.id,
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
