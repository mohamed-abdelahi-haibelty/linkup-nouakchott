"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CalendarRange,
  Clock,
  Search,
  SlidersHorizontal,
  Ticket,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import poster from "../../../public/one-piece-poster.png";
import StackedAvatar from "./components/StackedAvatar";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div dir="ltr" className="min-h-full mt-4">
      <div className="flex items-center md:max-w-3xl md:mx-auto justify-between gap-x-3">
        <div
          className={cn(
            "border-input flex h-11 w-full min-w-0 rounded-[4px] border bg-card px-3 py-1 md:py-4 text-base  transition-[color,box-shadow] outline-none  md:text-sm",
            "flex items-center  gap-x-3 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]"
          )}
        >
          <Search className="w-5 h-5" />
          <Input
            placeholder="Search for an event"
            className=" shadow-none bg-transparent border-none focus-visible:border-none focus-visible:ring-0 focus:outline-none ring-0 focus:ring-0 outline-none"
          />
        </div>
        <SlidersHorizontal className="md:hidden" />
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="font-semibold md:text-xl tracking-wide md:hidden">
            Discover Trending Events
          </p>
          {/* <Button className="shadow-xl">Create Event</Button> */}
        </div>
        <div className="mt-4 curso">
          <Card
            onClick={() => redirect("/events/jgkgu9e7uj4nf98whmo8eh45hfh")}
            className="w-[330px] cursor-pointer"
          >
            <CardContent>
              <div className="flex items-start gap-x-2">
                <Image
                  src={poster}
                  alt="event image"
                  width={130}
                  height={140}
                  className=" rounded-[8px] object-cover"
                  style={{ aspectRatio: "130/140", objectFit: "cover" }}
                />
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">TEDx Nouakchott</h2>
                  <p className="line-clamp-4 text-[13px] break-words overflow-hidden text-ellipsis max-w-[180px]">
                    TEDx Nouakchott 2025 brings together inspiring voices to
                    share ideas that spark change and celebrate local
                    innovation. Join us to explore how individual actions can
                    shape a brighter future.
                  </p>
                  <div className="flex items-center gap-x-1">
                    <StackedAvatar />
                    <div className="flex items-center gap-x-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">6/70</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 bg-background rounded-[8px] p-2 flex items-center justify-around">
                <div className="flex items-center gap-x-1">
                  <CalendarRange className="w-3.5 h-3.5 " />
                  <span className="text-xs">29 Aug 2025</span>
                </div>
                <div className="flex items-center gap-x-1">
                  <Clock className="w-3.5 h-3.5 " />
                  <span className="text-xs">10:00 AM</span>
                </div>
                <div className="flex items-center gap-x-1">
                  <Ticket className="w-3.5 h-3.5 " />
                  <span className="text-xs">Free</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
