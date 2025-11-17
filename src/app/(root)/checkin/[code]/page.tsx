import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerifyTicketButton from "../components/VerifyTicketButton";
import NotFound from "@/app/not-found";

interface CheckinPageProps {
  params: {
    code: string;
  };
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { getUser, isAuthenticated } = getKindeServerSession();

  // Check if user is logged in
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const user = await getUser();

  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch ticket with event and owner details
  const ticket = await prisma.ticket.findUnique({
    where: {
      code: params.code,
    },
    include: {
      event: {
        include: {
          organizer: true,
        },
      },
      user: true,
    },
  });

  // If ticket not found, show 404
  if (!ticket) {
    return NotFound();
  }

  const isOwner = ticket.userId === user.id;
  const isOrganizer = ticket.event.organizerId === user.id;

  // If user is neither owner nor organizer, show 404
  if (!isOwner && !isOrganizer) {
    return NotFound();
  }

  const now = new Date();
  const startTime = new Date(ticket.event.startTime);
  const endTime = new Date(ticket.event.endTime);
  const twoHoursBeforeStart = new Date(
    startTime.getTime() - 2 * 60 * 60 * 1000
  );

  // Determine ticket validity status
  let validityStatus: "valid" | "used" | "too-early" | "expired" | "cancelled" =
    "valid";
  let statusMessage = "";

  if (ticket.status === "cancelled") {
    validityStatus = "cancelled";
    statusMessage = "This ticket has been cancelled.";
  } else if (ticket.status === "used") {
    validityStatus = "used";
    statusMessage = "This ticket has already been used.";
  } else if (now < twoHoursBeforeStart) {
    validityStatus = "too-early";
    statusMessage = "Check-in opens 2 hours before event start.";
  } else if (now > endTime) {
    validityStatus = "expired";
    statusMessage = "This event has ended.";
  } else {
    validityStatus = "valid";
    statusMessage = "This ticket is valid and ready for check-in.";
  }

  // OWNER VIEW - Show ticket status
  if (isOwner) {
    return (
      <div className=" flex items-center justify-center p-4 bg-background">
        <Card className="max-w-lg w-full  bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-2xl">{ticket.event.title}</CardTitle>
            <CardDescription>
              Your ticket for{" "}
              {new Date(ticket.event.startTime).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-center">
              {validityStatus === "valid" && (
                <Badge className="text-lg py-2 px-4 bg-accent/80 hover:bg-accent">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Valid Ticket
                </Badge>
              )}
              {validityStatus === "cancelled" && (
                <Badge
                  variant="destructive"
                  className="text-lg py-2 px-4 bg-destructive/70"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Ticket Cancelled
                </Badge>
              )}
              {validityStatus === "used" && (
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Already Used
                </Badge>
              )}
              {validityStatus === "too-early" && (
                <Badge variant="outline" className="text-lg py-2 px-4">
                  <Clock className="mr-2 h-5 w-5" />
                  Check-in Not Open
                </Badge>
              )}
              {validityStatus === "expired" && (
                <Badge
                  variant="destructive"
                  className="text-lg py-2 px-4 bg-destructive/70"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Event Ended
                </Badge>
              )}
            </div>

            {/* Status Message */}
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{statusMessage}</p>
            </div>

            {/* Ticket Details */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Ticket Code
                </span>
                <span className="text-sm font-mono font-semibold">
                  {ticket.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium capitalize">
                  {ticket.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Event Date
                </span>
                <span className="text-sm">
                  {new Date(ticket.event.startTime).toLocaleString()}
                </span>
              </div>
              {ticket.scannedBy && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Scanned At
                  </span>
                  <span className="text-sm">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ORGANIZER VIEW - Show verification interface
  return (
    <div className=" flex items-center justify-center p-4 bg-background">
      <Card className="max-w-lg w-full border-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl">Ticket Verification</CardTitle>
          <CardDescription>{ticket.event.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-center">
            {validityStatus === "valid" && (
              <Badge className="text-lg py-2 px-4 bg-amber-100 hover:bg-amber-200/50">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Ready to Verify
              </Badge>
            )}
            {validityStatus === "used" && (
              <Badge variant="secondary" className="text-lg py-2 px-4 ">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Already Verified
              </Badge>
            )}
            {validityStatus === "too-early" && (
              <Badge variant="outline" className="text-lg py-2 px-4">
                <Clock className="mr-2 h-5 w-5" />
                Check-in Not Open
              </Badge>
            )}
            {validityStatus === "expired" && (
              <Badge
                variant="destructive"
                className="text-lg py-2 px-4 bg-destructive/70"
              >
                <XCircle className="mr-2 h-5 w-5" />
                Event Ended
              </Badge>
            )}
          </div>

          {/* Ticket Details */}
          <div className="space-y-3 bg-muted p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Attendee</span>
              <span className="text-sm font-medium">{ticket.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{ticket.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ticket Code</span>
              <span className="text-sm font-mono font-semibold">
                {ticket.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Current Status
              </span>
              <span className="text-sm font-medium capitalize">
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              {statusMessage}
            </p>
          </div>

          {/* Verify Button */}
          <VerifyTicketButton
            code={ticket.code}
            canVerify={validityStatus === "valid"}
            eventId={ticket.event.id}
          />

          {ticket.scannedBy && (
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              Verified on {new Date(ticket.updatedAt).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
