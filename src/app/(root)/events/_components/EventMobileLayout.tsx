import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventHero from "../_components/EventHero";
import ParticipantsList from "../_components/ParticipantsList";
import EventMainContent from "./EventMainContent";
import { EventWithParticipantsAndCounts } from "@/types";
import EventDetailsFooter from "@/components/shared/EventDetailsFooter";

type Props = {
  event: EventWithParticipantsAndCounts;
};

function EventMobileLayout({ event }: Props) {
  return (
    <div className="lg:hidden">
      <EventHero event={event} />
      <EventDetailsFooter />

      <Tabs className="mt-3 " defaultValue="About">
        <TabsList className="flex justify-center w-full">
          {/* <TabsTrigger value="Schedule"> Schedule</TabsTrigger> */}
          <TabsTrigger value="About">About</TabsTrigger>
          <TabsTrigger value="Participants">Participants</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="Schedule">
          <TimeLineList items={event.timelineItems} />
        </TabsContent> */}

        <TabsContent value="About" className="px-2 sm:px-4">
          <EventMainContent event={event} />
        </TabsContent>

        <TabsContent value="Participants">
          <ParticipantsList users={event.participants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EventMobileLayout;
