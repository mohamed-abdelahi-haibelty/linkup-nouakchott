import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Handle delayed session hydration for email login
  if (!user?.id) {
    console.log("User not ready yet, retrying...");
  }

  if (!user?.id) {
    console.error("Kinde user missing even after retry:", user);
    return NextResponse.redirect("/auth/error");
  }

  console.log("SESSION USER:", user);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!existingUser) {
    await prisma.user.upsert({
      where: {
        id: user?.id,
      },
      update: {
        name:
          `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim() ?? "User",
        email: user?.email ?? "",
        avatarUrl: user?.picture,
        phoneNumber: user?.phone_number,
      },
      create: {
        id: user.id,
        name:
          `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim() ?? "User",
        email: user?.email ?? "",
        avatarUrl: user?.picture,
        phoneNumber: user?.phone_number,
        role: "user",
      },
    });
  }

  const url = new URL(request.url);
  const redirectTo =
    url.searchParams.get("post_login_redirect_url") ||
    `${process.env.KINDE_SITE_URL}/events`;

  return NextResponse.redirect(redirectTo);
}
