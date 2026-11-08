import { formatDate, formatTime } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/features/events/actions/admin/getEvent";
import EventDescription from "@/features/events/components/EventDescription";
import {
  AlertCircle,
  Calendar,
  CalendarRange,
  Clock,
  MapPin,
  Phone,
  Receipt,
  Tag,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const url_param = await params;
  const id = url_param?.id;
  const { data } = await getEvent(id);
  const event = data;

  if (!event) {
    return notFound();
  }

  const registrationDeadline = event.registrationDeadline
    ? `${formatDate(event.registrationDeadline)} at ${formatTime(
        event.registrationDeadline,
      )}`
    : "Not specified";

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8  z-10 pb-12">
        {/* Title Card */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-balance">
              {event.title}
            </h1>
            {event.tag && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span className="text-sm capitalize">{event.tag}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  Event Image Preview
                  <Badge variant="outline" className="ml-auto text-xs">
                    Review Required
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border bg-muted">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Please verify that the event image is appropriate,
                      relevant to the event, and meets content guidelines before
                      approval.
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Image URL:</p>
                    <p className="font-mono break-all bg-muted p-2 rounded">
                      {event.imageUrl || "No image provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  Event Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EventDescription description={event.description} />
              </CardContent>
            </Card>

            {/* Event Details Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-accent" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Date
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.startTime)}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Time
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border sm:col-span-2">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Location
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Capacity
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {event.capacity} attendees
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <Receipt className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Price
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {"Free Event"}
                      </span>
                    </div>
                  </div>

                  {/* Registration Deadline */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border sm:col-span-2">
                    <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                      <CalendarRange className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground mb-1">
                        Registration Deadline
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {registrationDeadline}
                      </span>
                    </div>
                  </div>

                  {/* Contact Phone */}
                  {event.contactPhone && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border sm:col-span-2">
                      <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground mb-1">
                          Contact Phone
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {event.contactPhone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Organizer & Actions */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Organizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Organizer ID
                    </p>
                    <p className="text-sm font-mono text-foreground break-all">
                      {event.organizerId}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Submitted
                    </p>
                    <p className="text-sm text-foreground">
                      {formatDate(event.createdAt)}
                    </p>
                  </div>

                  {event.updatedAt && event.updatedAt !== event.createdAt && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm text-foreground">
                          {formatDate(event.updatedAt)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Event ID
                  </span>
                  <span className="text-xs font-mono text-foreground">
                    {event.id.slice(0, 8)}...
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <Badge variant="outline" className="capitalize">
                    {event.tag || "Uncategorized"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant={"secondary"}>{"Free"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
