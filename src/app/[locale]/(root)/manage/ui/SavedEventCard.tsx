"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, Loader2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

import { toast } from "sonner";
import { removeFromFavorites } from "@/app/[locale]/actions/favorite/removeFromFavorites";

type SavedEventCardProps = {
  event: {
    favoriteId: string;
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    location: string;
    startTime: Date;
    isFree: boolean;
    price: number;
    tag: string | null;
    organizer: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
    _count?: {
      participants: number;
    };
  };
};

export function SavedEventCard({ event }: SavedEventCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsRemoving(true);
      const res = await removeFromFavorites(event.favoriteId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/events/${event.id}_${event.slug}`);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          ) : (
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
          {event.tag && (
            <Badge variant="secondary" className="capitalize shrink-0">
              {event.tag}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {formatDate(event.startTime)} at {formatTime(event.startTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>{event._count?.participants || 0} participants</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.organizer.avatarUrl ? (
              <Image
                src={event.organizer.avatarUrl}
                alt={event.organizer.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {event.organizer.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {event.organizer.name}
            </span>
          </div>
          <Badge variant={event.isFree ? "secondary" : "default"}>
            {event.isFree ? "Free" : `${event.price} MRU`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
