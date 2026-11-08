import prisma from "@/lib/db";
import { postLoginRedirect } from "@/lib/redirects";
import { logError } from "@/lib/sentry";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = process.env.KINDE_SITE_URL || new URL(request.url).origin;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id || !user.email)
    return NextResponse.redirect(new URL("/auth/error", origin));
  try {
    const profile = {
      email: user.email,
      name:
        `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim() || "User",
      avatarUrl: user.picture,
      phoneNumber: user.phone_number,
    };
    // Identity is keyed by the provider subject, never by a caller-supplied email.
    await prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, ...profile, role: "user" },
      update: profile,
    });
  } catch (error) {
    logError(error, { operation: "auth-session" });
    return NextResponse.redirect(new URL("/auth/error", origin));
  }
  return NextResponse.redirect(
    postLoginRedirect(
      new URL(request.url).searchParams.get("post_login_redirect_url"),
      origin,
    ),
  );
}
