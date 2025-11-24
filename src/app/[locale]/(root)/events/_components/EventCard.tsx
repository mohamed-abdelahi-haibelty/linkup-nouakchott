import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CalendarRange, Clock, Ticket, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { tagColors } from "@/lib/constant";
import { formatDate, formatTime } from "@/lib/utils";
import { EventWithParticipants } from "@/types";
import StackedAvatar from "@/components/shared/StackedAvatar";
import { Link } from "@/i18n/navigation";

type EventCardProps = Pick<
  EventWithParticipants,
  | "id"
  | "slug"
  | "imageUrl"
  | "title"
  | "description"
  | "startTime"
  | "isFree"
  | "price"
  | "tag"
  | "participants"
  | "capacity"
  | "status"
>;

function EventCard({
  id,
  slug,
  imageUrl,
  title,
  description,
  startTime,
  isFree,
  price,
  tag,
  participants,
  capacity,
  status,
}: EventCardProps) {
  const priceValue = isFree ? "Free" : price;
  const formatedDate = formatDate(startTime);
  const formatedTime = formatTime(startTime);

  const registredParticipantsNum = participants.length;
  const usersList = participants?.map((p) => p.participant);
  const participantsCount = participants.length;

  const eventLink = `/events/${id}_${slug}`;

  return (
    <Link href={eventLink}>
      <Card className="w-[330px] md:w-[360px] lg:w-[470px] xl:w-[390px] h-[244px] group  cursor-pointer hover:shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)] transition-shadow">
        <CardContent className="h-full flex flex-col justify-between">
          <div className="flex items-start gap-x-2 ">
            <div className="relative w-[130px] h-[140px] shrink-0">
              <Image
                src={imageUrl ?? "/one-piece-poster.png"}
                alt="event image"
                fill
                className=" rounded-[8px] object-cover group-hover:opacity-95 transition-opacity"
              />
              {(tag || status === "demo") && (
                <Badge
                  className="absolute top-2 left-2 capitalize"
                  style={{
                    backgroundColor:
                      status === "demo"
                        ? "#EDE9FE"
                        : tagColors[tag as string]?.bg || "#E3DFF2",
                    color:
                      status === "demo"
                        ? "#6B21A8"
                        : tagColors[tag as string]?.text || "#1F2937",
                  }}
                >
                  {status === "demo" ? "Demo" : tag}
                </Badge>
              )}
            </div>
            <div className="flex flex-col justify-between h-[140px]">
              <div>
                <h2 className="text-sm font-semibold truncate max-w-[150px] md:max-w-[180px] lg:max-w-[200px]">
                  {title}
                </h2>
                <p className="line-clamp-4 text-[13px] break-words overflow-hidden text-ellipsis max-w-[150px] md:max-w-[180px] lg:max-w-[200px]">
                  {description}
                  &nbsp;
                </p>
              </div>
              <div className="flex items-center gap-x-1">
                {participantsCount > 0 && (
                  <>
                    <StackedAvatar users={usersList} />

                    <div className="flex items-center gap-x-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">
                        {registredParticipantsNum}/{capacity}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 bg-background  rounded-[8px] p-2 flex items-center justify-around">
            <div className="flex items-center gap-x-1">
              <CalendarRange className="w-3.5 h-3.5 " />
              <span className="text-xs">{formatedDate}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Clock className="w-3.5 h-3.5 " />
              <span className="text-xs">{formatedTime}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Ticket className="w-3.5 h-3.5  " />
              <span className="text-xs">{priceValue.toString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default EventCard;
