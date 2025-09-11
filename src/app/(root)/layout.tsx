"use client";
import React, { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import EventDetailsFooter from "./components/EventDetailsFooter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function WebsiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isEventDetailsPage =
    pathname?.startsWith("/events/") && pathname.split("/").length === 3;

  const isEventPage = pathname === "/";

  if (isEventDetailsPage) {
    return (
      <div className="h-full">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <main className="min-h-screen px-2 pb-24">{children}</main>
        <EventDetailsFooter />
      </div>
    );
  }

  if (isEventPage) {
    return (
      <div className="h-full">
        <Navbar />
        <main className="h-full pt-20 mx-6">{children}</main>
        <div
          className="hidden fixed md:flex items-center justify-center bottom-5 z-50 w-12
           mx-auto left-0 right-0 "
        >
          <Button className="bg-white border rounded-sm   ">
            <Plus className="w-5 h-5" />
          </Button>
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
