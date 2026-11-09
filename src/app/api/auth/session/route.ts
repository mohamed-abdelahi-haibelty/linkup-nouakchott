import { getGuest, GUEST_COOKIE } from "@/lib/guest";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    Sentry.captureMessage("Invalid Kinde session", {
      level: "error",
      extra: { user },
    });

    return NextResponse.redirect("/auth/error");
  }

  // Attach authenticated user to Sentry scope
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name:
            `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim() ||
            "User",
          avatarUrl: user.picture,
          phoneNumber: user.phone_number,
          role: "user",
        },
      });

      Sentry.captureMessage("User created from Kinde login", {
        level: "info",
        extra: {
          kindeUserId: user.id,
          email: user.email,
        },
      });
    } else {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          name:
            `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim() ||
            existingUser.name,
          avatarUrl: user.picture,
          phoneNumber: user.phone_number,
        },
      });

      Sentry.captureMessage("User updated from Kinde login", {
        level: "info",
        extra: {
          userId: existingUser.id,
          email: existingUser.email,
        },
      });
    }
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        kindeUserId: user.id,
        email: user.email,
      },
    });

    return NextResponse.redirect("/auth/error");
  }

  const url = new URL(request.url);
  const redirectTo =
    url.searchParams.get("post_login_redirect_url") ||
    `${process.env.KINDE_SITE_URL}/events`;

  // A completed regular login ends any previous anonymous session.
  const guest = await getGuest();
  if (guest) {
    await prisma.guestSession.updateMany({
      where: { userId: guest.id },
      data: { expiresAt: new Date(0) },
    });
  }
  const response = NextResponse.redirect(redirectTo);
  response.cookies.set(GUEST_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
