"use client";
import { ReactNode } from "react";
import EventDetailsFooter from "../../components/shared/EventDetailsFooter";
import Footer from "../../components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";
import CreateEventButton from "./events/_components/CreateEventButton";

function WebsiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isEventDetailsPage =
    pathname?.startsWith("/events/") && pathname.split("/").length === 3;

  const isEventsPage = pathname === "/events";
  if (isEventDetailsPage) {
    return (
      <div className="h-full">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <main className="min-h-screen px-2 pb-24">{children}</main>
        {/* <EventDetailsFooter /> */}
      </div>
    );
  }

  if (isEventsPage) {
    return (
      <div className="h-full ">
        <Navbar />
        <main className="h-full pt-20 mx-6">{children}</main>
        <div
          className="hidden fixed md:flex items-center justify-center bottom-5 z-50 w-12
           mx-auto left-0 right-0 "
        >
          <CreateEventButton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-20 mx-6">{children}</main>
      <Footer />
    </div>
  );
}

export default WebsiteLayout;
