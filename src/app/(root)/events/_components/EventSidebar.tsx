"use client";

import {
  EventWithParticipantsAndCounts,
  ParticipantWithUserAndCount,
} from "@/types";
import ParticipantsSection from "./ParticipantsSection";
import { JoinEventButton } from "@/components/shared/JoinEventButton";

type Props = {
  participants: ParticipantWithUserAndCount[];
  event: EventWithParticipantsAndCounts;
  phone: string;
};

// _components/EventSidebar.tsx
export function EventSidebar({ participants, event, phone }: Props) {
  return (
    <div className="fixed right-6 xl:right-34 lg:w-1/3 xl:w-[400px] h-[calc(100vh-80px)] flex flex-col gap-4">
      <div className="flex-1">
        <ParticipantsSection users={participants} />
      </div>
      <div className="flex justify-end mb-2">
        <div className=" bg-card/50 shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)] border-border/60 backdrop-blur-sm rounded-lg p-3 w-full  border mx-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold ">Join this event</h3>
            <p className="text-sm  mb-2 pb-2 border-b border-dashed">
              Secure your place and be part of this experience.
            </p>
          </div>
          <JoinEventButton
            event={event}
            variant="outline"
            className="w-full bg-accent border"
            phone={phone}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <ScheduleSection items={timelineItems} /> */
}
