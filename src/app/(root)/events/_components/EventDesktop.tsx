import EventHero from "../_components/EventHero";
import EventMainContent from "./EventMainContent";
import { EventWithParticipantsAndTimeLineItems } from "@/types";
import { EventSidebar } from "./EventSidebar";

type Props = {
  event: EventWithParticipantsAndTimeLineItems;
};

function EventDesktop({ event }: Props) {
  const users = event.participants;
  const timelineItems = event.timelineItems;
  return (
    <div className="hidden mt-[100px] mb-4 mx-6 sm:grid grid-cols-3 gap-x-24 min-h-[calc(100%-128px)]">
      <div className=" col-span-2 ">
        <EventHero event={event} />
        <EventMainContent event={event} />
      </div>
      <EventSidebar
        eventId={event.id}
        capacity={event.capacity}
        participants={users}
        timelineItems={timelineItems}
      />
    </div>
  );
}

export default EventDesktop;
