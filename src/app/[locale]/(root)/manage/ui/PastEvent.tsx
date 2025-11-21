import { AlarmClock, CalendarClock } from "lucide-react";
import Image from "next/image";
import type { EventWithParticipants } from "@/types";
import Link from "next/link";

type Props = {
  event: EventWithParticipants;
};

export default function PastEvent({ event }: Props) {
  const eventDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const formattedStartTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const url = `/events/${event.id}_${event.slug}`;

  return (
    <div className=" bg-card rounded-2xl border-border/50 hover:shadow-md transition-shadow">
      <Link href={url}>
        <div className="p-4 flex items-start gap-4">
          {/* Event Image */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground line-clamp-1 mb-2">
              {event.title}
            </h3>

            <div className="flex items-center gap-2 text-sm">
              {/* Date */}
              <div className="flex text-xs md:text-sm items-center gap-1 md:gap-2 text-muted-foreground">
                <CalendarClock className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>

              {/* Vertical separator */}
              <span
                className="inline-block h-4 border-l border-border/50 mx-2"
                aria-hidden
              />

              {/* Time */}
              <div className="flex text-xs md:text-sm items-center gap-2 text-muted-foreground">
                <AlarmClock className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">
                  {formattedStartTime} - {formattedEndTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
