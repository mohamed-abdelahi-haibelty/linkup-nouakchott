import { ParticipantWithUserAndCount } from "@/types";
import Image from "next/image";

function ParticipantItem({
  participant,
  attendedEventsCount,
}: ParticipantWithUserAndCount) {
  // We check if it exists AND if it's NOT the "blank" gravatar placeholder
  const hasValidAvatar =
    participant.avatarUrl && !participant.avatarUrl.includes("d=blank");

  // 2. Determine the final source
  const avatarSrc = hasValidAvatar
    ? participant.avatarUrl
    : "/images/download.jpeg";
  return (
    <div className="flex items-start gap-x-2  border rounded-lg bg-card p-2">
      <div className="relative">
        {/* Todo : add a fallback iamge */}
        <Image
          className="rounded-full aspect-square border-2 border-primary/20"
          width={40}
          height={40}
          src={avatarSrc!}
          alt={participant.name ?? "Participant"}
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
