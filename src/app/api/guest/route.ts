import { randomBytes, randomUUID, createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GUEST_COOKIE, getGuest, hashToken } from "@/lib/guest";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  return NextResponse.json(
    {
      user: (await getKindeServerSession().getUser()) ? null : await getGuest(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function sameOrigin(request: NextRequest) {
  return (
    request.headers.get("origin") ===
    new URL(process.env.KINDE_SITE_URL!).origin
  );
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  if ((await getKindeServerSession().getUser()) || (await getGuest()))
    return NextResponse.json({ success: true });
  const secret = process.env.KINDE_CLIENT_SECRET;
  if (!secret) return new NextResponse(null, { status: 503 });
  // Vercel overwrites this header. Never trust a client-supplied user identifier.
  const ip = request.headers.get("x-vercel-forwarded-for") || "local";
  const ipHash = createHmac("sha256", secret).update(ip).digest("hex");
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const created = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${ipHash}))`;
    const count = await tx.guestSession.count({
      where: { ipHash, createdAt: { gt: new Date(Date.now() - 3600000) } },
    });
    if (count >= 5) return false;
    const id = `guest_${randomUUID()}`;
    await tx.user.create({
      data: { id, name: "Guest", email: `${id}@guest.invalid` },
    });
    await tx.guestSession.create({
      data: { tokenHash: hashToken(token), userId: id, ipHash, expiresAt },
    });
    return true;
  });
  if (!created)
    return NextResponse.json(
      { error: "Please try again later." },
      { status: 429 },
    );
  const response = NextResponse.json({ success: true });
  response.cookies.set(GUEST_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  const guest = await getGuest();
  if (guest)
    await prisma.guestSession.updateMany({
      where: { userId: guest.id },
      data: { expiresAt: new Date(0) },
    });
  const response = NextResponse.json({ success: true });
  response.cookies.set(GUEST_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
