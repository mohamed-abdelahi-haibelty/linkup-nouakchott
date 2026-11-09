import EventHero from "@/features/events/components/EventHero";
import EventMainContent from "@/features/events/components/EventMainContent";
import { EventSidebar } from "@/features/events/components/EventSidebar";
import { EventWithParticipantsAndCounts } from "@/types/index";

type Props = {
  event: EventWithParticipantsAndCounts;
  phone: string;
};

function EventDesktop({ event, phone }: Props) {
  const users = event.participants;
  return (
    <div className="hidden container mx-auto mb-4 lg:grid grid-cols-3 gap-x-24 min-h-[calc(100%-128px)]">
      <div className="col-span-2">
        <EventHero event={event} />
        <EventMainContent event={event} />
      </div>
      <EventSidebar event={event} participants={users} phone={phone} />
    </div>
  );
}

export default EventDesktop;
