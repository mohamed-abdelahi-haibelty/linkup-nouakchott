"use client";

import { toggleFavorite } from "@/features/favorites/actions/toggleFavorite";
import { cn } from "@/lib/utils";
import { EventWithParticipantsAndCounts } from "@/types";
import { FavoriteType } from "@prisma/client";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { JoinEventButton } from "./JoinEventButton";

type Props = {
  event: EventWithParticipantsAndCounts;
  phone: string;
  favoriteStatus: {
    isAuthenticated: boolean;
    isFavorited: boolean;
  };
};

function EventDetailsFooter({ event, favoriteStatus, phone }: Props) {
  // Initial favorite state (server-rendered or default false)
  const [isFavorited, setIsFavorited] = useState(
    favoriteStatus.isFavorited ?? false,
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleFavorite = () => {
    if (!favoriteStatus.isAuthenticated) {
      toast.warning("Login To add event to favorite");
      return;
    }
    // Optimistic update — instant toggle
    setIsFavorited((prev) => !prev);

    startTransition(async () => {
      const res = await toggleFavorite(event.id, FavoriteType.event);

      // Rollback on failure
      if (!res.success) {
        setIsFavorited((prev) => !prev);
        toast.error("Failed to toggle favorite");
        console.error("Failed to toggle favorite:", res.message);
      }
    });
  };
  return (
    <div
      className="fixed bottom-0 z-50 w-full
           bg-card  px-3 py-3  left-0 right-0 sm:hidden"
    >
      <div className="flex items-center gap-x-2">
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isPending}
          aria-label="Toggle favorite"
          className={cn(
            "p-4 border-2 border-none rounded-full bg-background hover:shadow-xs hover:bg-muted transition-colors",
            isFavorited && "text-red-500",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isFavorited && "fill-red-500 text-red-500 scale-110",
            )}
          />
        </button>
        <JoinEventButton
          event={event}
          variant="outline"
          className="w-full bg-accent flex-1 border-none  rounded-full p-6"
          phone={phone}
        />
      </div>
    </div>
  );
}

export default EventDetailsFooter;
