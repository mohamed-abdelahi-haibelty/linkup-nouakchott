import Image from "next/image";
import { formatDate, formatTime } from "@/lib/utils";

import { EventTicketProps } from "@/types/index";

export function EventTicket({
  title,
  startTime,
  endTime,
  qrUrl,
}: EventTicketProps) {
  return (
    <div className="relative bg-foreground rounded-b-2xl overflow-hidden text-white">
      {/* Left Notch */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-r-full -ml-3" />

      {/* Right Notch */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-l-full -mr-3" />

      {/* Dashed Divider */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/70 z-10 [mask-image:radial-gradient(circle,white_70%,transparent_71%)]" />

      {/* Ticket Content */}
      <div className="relative z-20 flex flex-col">
        {/* Top half */}
        <div className="px-8 pt-6 pb-10">
          <h1 className="text-center mb-1">
            Your Ticket for <span className="font-bold">{title}</span>
          </h1>

          <p className="text-sm text-center mb-3 mt-3">
            Ticket will be active from
          </p>

          <div className="border bg-white text-foreground rounded-lg px-4 py-3 flex justify-between items-center flex-wrap gap-4">
            <div className="text-center flex-1">
              <h3 className="font-semibold">{formatTime(startTime)}</h3>
              <span className="text-xs">{formatDate(startTime)}</span>
            </div>
            <div className="text-center flex-1">
              <h3 className="font-semibold">{formatTime(endTime)}</h3>
              <span className="text-xs">{formatDate(endTime)}</span>
            </div>
          </div>
        </div>

        {/* Bottom half */}
        <div className="px-8 pt-10 pb-8 flex justify-center">
          <Image
            unoptimized
            width={140}
            height={140}
            src={qrUrl}
            alt="QR Ticket"
            className="block mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
