"use client";
import EventDetailsFooter from "@/components/shared/EventDetailsFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventHero from "@/features/events/components/EventHero";
import EventMainContent from "@/features/events/components/EventMainContent";
import ParticipantsList from "@/features/events/components/ParticipantsList";
import { EventWithParticipantsAndCounts } from "@/types/index";
import { useTranslations } from "next-intl";

type Props = {
  event: EventWithParticipantsAndCounts;
  phone: string;
  favoriteStatus: {
    isAuthenticated: boolean;
    isFavorited: boolean;
  };
};

function EventMobileLayout({ event, favoriteStatus, phone }: Props) {
  const t = useTranslations("events.details.tabs");
  return (
    <div className="lg:hidden">
      <EventHero event={event} />
      <EventDetailsFooter
        event={event}
        favoriteStatus={favoriteStatus}
        phone={phone}
      />

      <Tabs className="mt-3 " defaultValue="About">
        <TabsList className="flex justify-center w-full">
          {/* <TabsTrigger value="Schedule"> Schedule</TabsTrigger> */}
          <TabsTrigger value="About">{t("about")}</TabsTrigger>
          <TabsTrigger value="Participants">{t("participants")}</TabsTrigger>
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
