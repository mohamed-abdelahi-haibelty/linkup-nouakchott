"use server";
import prisma from "@/lib/db";
import { EventFormInput, eventFormSchema } from "@/lib/validation/event";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/sentry";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { EventStatus, Prisma } from "@prisma/client";
import { getUserRole } from "../../user/getUserRole";

export async function createEvent(data: EventFormInput) {
  const { success, message, user } = await getUserRole();

  if (!success || !user) return { success, message, data };

  const parsed = eventFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
      error: parsed.error.flatten().fieldErrors,
      data: null,
      code: 400,
    };
  }

  const organizerId = user?.id;
  let status: EventStatus = EventStatus.pending;

  if (user.role === "admin") {
    status = EventStatus.approved;
  }

  try {
    const event = await prisma.event.create({
      data: {
        ...parsed.data,
        status,
        price: parsed.data?.price ?? 0,
        slug: generateSlug(parsed.data.title),
        organizerId: organizerId,
      },
    });

    revalidatePath("/events");
    return {
      success: true,
      event,
      message: "Event created successfully!",
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
        // Unique constraint violation
        const target = e.meta?.target as string[] | undefined;
        if (target?.includes("slug")) {
          return {
            success: false,
            message: "An event with this title already exists.",
            errorCode: "SLUG_CONFLICT",
          };
        }
        return {
          success: false,
          message: "An event with similar details already exists.",
          errorCode: "DUPLICATE_ENTRY",
        };
      }

      if (e.code === "P2003") {
        // Foreign key constraint violation
        return {
          success: false,
          message: "Invalid reference data. Please check your inputs.",
          errorCode: "FK_CONSTRAINT",
        };
      }
    }
    return {
      success: false,
      message: "Failed to create event. Please try again later.",
      errorCode: "UNEXPECTED_ERROR",
      code: 500,
    };
  }
}
