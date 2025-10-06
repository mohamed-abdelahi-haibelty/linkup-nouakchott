import {
  CalendarRange,
  ChevronLeft,
  Clock,
  Share2,
  Ticket,
} from "lucide-react";
import Image from "next/image";

import { formatDate, formatTime } from "@/lib/utils";
import EventInfoCard from "./EventInfoCard";
import { BackButton } from "@/components/shared/BackButton";
import StackedAvatar from "@/components/shared/StackedAvatar";
import { EventWithParticipantsAndCounts } from "@/types";

type EventHeroProps = Pick<
  EventWithParticipantsAndCounts,
  | "title"
  | "description"
  | "imageUrl"
  | "startTime"
  | "isFree"
  | "price"
  | "participants"
  | "capacity"
>;

type EventHeroComponentProps = {
  event: EventHeroProps;
};

function EventHero({ event }: EventHeroComponentProps) {
  const {
    title,
    imageUrl,
    description,
    participants,
    startTime,
    isFree,
    price,
  } = event;
  const usersList =
    participants.length > 0 ? participants.map((user) => user.participant) : [];

  const infoItems = [
    {
      icon: <CalendarRange className="w-4 h-4 text-white" />,
      label: formatDate(startTime),
    },
    {
      icon: <Clock className="w-4 h-4 text-white" />,
      label: formatTime(startTime),
    },
    {
      icon: <Ticket className="w-4 h-4 text-white" />,
      label: isFree ? "Free" : price,
    },
  ];

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl h-[55vh] sm:h-[70vh]">
      {/* Background Image */}
      <Image
        src={imageUrl!}
        alt={title}
        fill
        priority
        className="object-cover w-full h-full"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:via-black/30"></div> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>

      {/* Navigation Buttons */}
      <div className="absolute top-4 sm:top-6 left-4 right-4 z-30 flex items-center justify-between">
        <BackButton />
        <button className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300">
          <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end items-center p-4 sm:p-8 z-20">
        {/* Profile Image */}
        <Image
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 object-cover shadow-xl mb-4 sm:mb-6"
          src={imageUrl!}
          alt={title}
          width={128} // or 96 for mobile size
          height={128} // or 96
        />

        {/* Event Title */}
        <h1 className="text-lg sm:text-4xl font-bold text-white mb-2 sm:mb-4 text-center">
          {title}
        </h1>

        {/* Event Description */}
        <p className="text-xs sm:text-lg text-white/90 text-center max-w-[300px] sm:max-w-2xl mb-2 sm:mb-6 leading-relaxed line-clamp-4">
          {description}
        </p>

        {/* Participants */}
        <StackedAvatar users={usersList} className="mb-2 sm:mb-6" />

        {/* Event Info Cards */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          {infoItems.map((item, idx) => (
            <EventInfoCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventHero;
