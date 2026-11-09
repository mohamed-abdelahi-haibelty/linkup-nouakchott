"use server";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/server/errors";
import { revalidatePath } from "next/cache";

import { getUserRole } from "@/features/users/actions/getUserRole";
import { sendPushNotifications } from "@/server/notifications";
import { CommunityPostStatus, NotificationType } from "@prisma/client";

export async function changeCommunityPostStatus(
  postId: string,
  status: CommunityPostStatus,
) {
  try {
    const { success, user, message } = await getUserRole();
    if (!success || !user) return { success, message, data: null };

    if (user.role !== "admin" && user.role !== "moderator") {
      return {
        success: false,
        message: "You are not authorized to change community post status.",
        data: null,
      };
    }

    // Get the post with user info
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          include: {
            pushSubscriptions: true,
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Community post not found.",
        data: null,
      };
    }

    // Update post status with approval/rejection timestamp
    const updateData: Prisma.CommunityPostUncheckedUpdateInput = { status };

    if (status === "approved") {
      updateData.approvedAt = new Date();
      updateData.approvedById = user.id;
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
    }

    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: updateData,
    });

    // Prepare notification data based on status
    let notificationTitle = "";
    let notificationBody = "";
    let notificationType: NotificationType = "general";
    let actionUrl = "";

    if (status === "approved") {
      notificationTitle = "Post Approved!";
      notificationBody = `Great news! Your community post${
        post.title ? ` "${post.title}"` : ""
      } has been approved and is now visible to everyone!`;
      notificationType = "post_accepted";
      actionUrl = `/community`; // Redirect to community page
    } else if (status === "rejected") {
      notificationTitle = "Post Review Update";
      notificationBody = `Unfortunately, your community post${
        post.title ? ` "${post.title}"` : ""
      } was not approved. Please review our community guidelines or contact support for more information.`;
      notificationType = "general";
      actionUrl = `/community`;
    }

    // Create in-app notification in database
    await prisma.notification.create({
      data: {
        userId: post.userId,
        title: notificationTitle,
        message: notificationBody,
        type: notificationType,
        actionUrl: actionUrl,
      },
    });

    // Send push notification to all user's subscriptions
    if (post.user.pushSubscriptions.length > 0) {
      await sendPushNotifications(
        post.user.pushSubscriptions,
        notificationTitle,
        notificationBody,
        actionUrl,
      );
    }

    revalidatePath("/admin/community");
    revalidatePath("/community");

    return {
      success: true,
      message: "Community post status updated successfully",
      data: updatedPost,
    };
  } catch (err) {
    return handlePrismaError(err);
  }
}
