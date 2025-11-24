"use client";
import React from "react";
import EventDescription from "./EventDescription";
import EventDetailedCard from "./EventDetailedCard";
import OrganizerCard from "./OrganizerCard";
import { EventWithParticipantsAndCounts } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  event: EventWithParticipantsAndCounts;
};

function EventMainContent({ event }: Props) {
  const t = useTranslations("demo");
  const isDemo = event?.status === "demo";

  return (
    <div className="flex flex-col space-y-4 mt-4">
      {isDemo && (
        <div className="p-3 rounded bg-primary/10  text-sm mt-2">
          {t.rich("message", {
            strong: (chunk) => <strong>{chunk}</strong>,
          })}
        </div>
      )}

      <EventDescription description={event.description} />
      <EventDetailedCard event={event} />
      <OrganizerCard organizer={event.organizer} phone={event.contactPhone!} />
    </div>
  );
}

export default EventMainContent;
