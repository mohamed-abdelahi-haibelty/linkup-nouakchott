"use client";

import { useEffect, useState } from "react";
import type { EventWithParticipants } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users } from "lucide-react";
import StackedAvatar from "@/components/shared/StackedAvatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  data: EventWithParticipants[];
};

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function CountdownTimer({ startTime }: { startTime: Date }) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(startTime).getTime();
      const distance = target - now;

      if (distance < 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        clearInterval(interval);
      } else {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          expired: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const t = useTranslations("myhub.upcomingEvents");

  if (countdown.expired) {
    return (
      <div className="text-center">
        <p className="text-sm font-semibold text-destructive">{t("started")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2">
      <CountdownUnit label="Days" value={countdown.days} />
      <CountdownUnit label="Hrs" value={countdown.hours} />
      <CountdownUnit label="Min" value={countdown.minutes} />
      <CountdownUnit label="Sec" value={countdown.seconds} />
    </div>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-lg px-2 py-2 sm:px-3 sm:py-3 backdrop-blur-sm border border-dashed ">
        <p className="text-xl sm:text-2xl font-bold">
          {String(value).padStart(2, "0")}
        </p>
      </div>
      <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
        {label}
      </p>
    </div>
  );
}

export default function UpcomingEventsCountdown({ data }: Props) {
  const t = useTranslations("myhub.upcomingEvents");
  // Filter only upcoming events
  const upcomingEvents = data.filter(
    (event) => new Date(event.startTime) > new Date()
  );

  if (upcomingEvents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">{t("noEvents")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 
    md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:mx-0"
      >
        {upcomingEvents.map((event) => {
          const usersList =
            event.participants.length > 0
              ? event.participants.map((user) => user.participant)
              : [];
          const participantsCount = event.participants.length;
          const eventDate = new Date(event.startTime);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const formattedTime = eventDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const url = `/events/${event.id}_${event.slug}`;

          return (
            <Card
              key={event.id}
              className=" min-w-[85%] sm:min-w-[350px] md:min-w-0  hover:shadow-lg border-dashed transition-all rounded-xl duration-300 border-border/50 h-full flex flex-col"
            >
              <Link href={url}>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg line-clamp-1 text-card-foreground">
                      {event.title}
                    </h3>
                  </div>

                  <div className="border-t border-dashed border-border/50 pt-3">
                    {participantsCount > 0 ? (
                      <div className="flex items-center gap-2">
                        <StackedAvatar users={usersList} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground/40" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {t("noParticipants")}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {event.description}
                  </p>

                  <div className="mb-4 p-3 rounded-lg  border border-border/50 border-dashed">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      {t("startsIn")}
                    </p>
                    <CountdownTimer startTime={event.startTime} />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4 " />
                    <span className="font-medium">
                      {formattedDate} at {formattedTime}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4  flex-shrink-0 mt-0.5" />
                    <span className="font-medium line-clamp-1">
                      {event.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4 p-2 rounded  border border-dashed border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {event.isFree
                        ? t("freeEvent")
                        : `$${event.price.toFixed(2)}`}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {event.capacity - event.participants.length}{" "}
                      {t("spotsLeft")}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
