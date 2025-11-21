import React from "react";
import EventDescription from "./EventDescription";
import EventDetailedCard from "./EventDetailedCard";
import OrganizerCard from "./OrganizerCard";
import { EventWithParticipantsAndCounts } from "@/types";

type Props = {
  event: EventWithParticipantsAndCounts;
};

function EventMainContent({ event }: Props) {
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <EventDescription description={event.description} />
      <EventDetailedCard event={event} />
      <OrganizerCard organizer={event.organizer} phone={event.contactPhone!} />
    </div>
  );
}

export default EventMainContent;
