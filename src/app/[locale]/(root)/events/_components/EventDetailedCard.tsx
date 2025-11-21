"use client";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { EventWithParticipantsAndCounts } from "@/types";
import { Calendar, CalendarRange, MapPin, Receipt, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { JSX } from "react";

export interface EventDetailItem {
  icon: JSX.Element;
  label: string;
  value: string;
}

type Props = {
  event: EventWithParticipantsAndCounts;
};

function EventDetailedCard({ event }: Props) {
  const {
    startTime,
    endTime,
    location,
    isFree,
    price,
    participants,
    capacity,
  } = event;

  const spotsRemaining = capacity - participants.length;
  const attendeesCount = participants.length;
  const t = useTranslations("events.details.detailedCard");

  function getCapacityMessage() {
    if (spotsRemaining === 0) {
      return t("eventFull"); // "Event Full"
    }

    return `${spotsRemaining} ${
      spotsRemaining === 1 ? t("spot") /* "spot" */ : t("spots") /* "spots" */
    } ${t("available") /* "available" */}`;
  }

  const getPricingMessage = (): string => {
    if (isFree) {
      return t("freeRegistrationMessage"); // "Free registration"
    }
    return t("paidRegistrationMessage"); // "Paid registration"
  };

  const eventDetails: EventDetailItem[] = [
    {
      icon: <Calendar className="w-4 h-4 text-accent" />,
      label: formatDate(startTime),
      value: `${formatTime(startTime)} - ${formatTime(endTime)}`,
    },
    {
      icon: <MapPin className="w-4 h-4 text-accent" />,
      label: t("locationLabel"), // "Location"
      value: location,
    },
    {
      icon: <Users className="w-4 h-4 text-accent" />,
      label: `${attendeesCount} ${
        attendeesCount === 1
          ? t("person") /* "person" */
          : t("people") /* "people" */
      } ${t("attending") /* "attending" */}`,
      value: getCapacityMessage(),
    },
    {
      icon: <Receipt className="w-4 h-4 text-accent" />,
      label: isFree
        ? t("freeEventLabel") /* "Free Event" */
        : `${t("price") /* "Price" */}: ${price || t("tba") /* "TBA" */} MRU`,
      value: getPricingMessage(),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-accent/10 rounded-md">
          <CalendarRange className="w-4 h-4 text-accent" />
        </div>
        <h2 className="font-semibold text-sm text-foreground">
          {t("eventDetailsTitle")} {/* "Event Details" */}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {eventDetails.map((details, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-3 rounded-md border",
              (Math.floor(index / 2) + (index % 2)) % 2 === 0
                ? "bg-card"
                : "bg-background"
            )}
          >
            <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
              {details.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm text-foreground">
                {details.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {details.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventDetailedCard;
