import { ParticipantWithUserAndCount } from "@/types";
import Image from "next/image";

function ParticipantItem({
  participant,
  attendedEventsCount,
}: ParticipantWithUserAndCount) {
  return (
    <div className="flex items-start gap-x-2  border rounded-lg bg-card p-2">
      <div className="relative">
        {/* Todo : add a fallback iamge */}
        <Image
          className="rounded-full aspect-square border-2 border-primary/20"
          width={40}
          height={40}
          src={participant.avatarUrl!}
          alt="Organizer"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground truncate">
          {participant.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {attendedEventsCount > 0
            ? `${attendedEventsCount} events attended`
            : "No events attended yet"}
        </p>
      </div>
    </div>
  );
}

export default ParticipantItem;
