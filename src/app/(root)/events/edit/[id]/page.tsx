import NotFound from "@/app/not-found";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import EditFormEvent from "../../_components/EditEventForm";
interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const url = await params;
  const id = url.id;
  const user = await getUser();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const event = await prisma?.event.findUnique({
    where: {
      id,
      organizerId: user?.id,
    },
    include: {
      participants: { include: { participant: true } },
    },
  });

  if (!event) {
    return NotFound();
  }

  return <EditFormEvent id={id} event={event} />;
}

export default page;
