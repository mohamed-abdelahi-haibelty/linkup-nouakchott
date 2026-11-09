import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { getAppSession } from "@/lib/app-session";
import { XCircle } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import EventScannerClient from "@/features/tickets/components/EventScannerClient";

interface EventScanPageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function page({ params }: EventScanPageProps) {
  const { getUser, isAuthenticated } = getAppSession();
  const { id, locale } = await params;
  setRequestLocale(locale);
  // Check if user is logged in
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const user = await getUser();

  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch event details
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      organizer: true,
    },
  });

  // If event not found, show 404
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-6 w-6" />
              Event Not Found
            </CardTitle>
            <CardDescription>
              The event you&apos;re looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check if user is the organizer
  const isOrganizer = event.organizerId === user.id;

  // If user is not the organizer, show 404
  if (!isOrganizer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Only the event organizer can access the scanner for this event.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Pass event details to client component
  return (
    <EventScannerClient
      eventId={event.id}
      eventTitle={event.title}
      eventStartTime={event.startTime}
      eventEndTime={event.endTime}
    />
  );
}

export default page;
