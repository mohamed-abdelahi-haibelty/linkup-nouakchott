"use client";

import { ParticipantWithUserAndCount } from "@/types";
import ParticipantsSection from "./ParticipantsSection";
import { JoinEventButton } from "@/components/shared/JoinEventButton";

type Props = {
  participants: ParticipantWithUserAndCount[];
  eventId: string;
  capacity: number;
};

// _components/EventSidebar.tsx
export function EventSidebar({ participants, eventId }: Props) {
  const participantsCount = participants?.length;
  const handleJoinEvent = async (eventId: string) => {
    console.log("[v0] Joining event:", eventId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleLeaveEvent = async (eventId: string) => {
    console.log("[v0] Leaving event:", eventId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="fixed top-[100px] right-6 w-1/3 h-[calc(100vh-100px)] flex flex-col gap-4">
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
            eventId={eventId}
            variant="outline"
            className="w-full bg-accent border"
            participantCount={participantsCount}
            maxCapacity={25}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <ScheduleSection items={timelineItems} /> */
}
