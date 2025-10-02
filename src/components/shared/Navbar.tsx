"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Cable } from "lucide-react";
import { useScrollTop } from "@/hooks/useScrollTop";
import AuthHeader from "./AuthHeader";

function Navbar() {
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "p-6 fixed z-50 top-0 h-20 w-full bg-background",
        scrolled && "border-b shadow-xs"
      )}
    >
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cable className="" />
          <span className="text-lg font-semibold ">LinkUp Nouakchott</span>
        </div>

        <div className="flex items-center gap-x-1 p-1 bg-white border rounded-lg">
          <Button
            asChild
            variant={"ghost"}
            className=" bg-background border-transparent p-2 hover:text-primary-foreground"
          >
            <Link href={"/events"}>Discover</Link>
          </Button>
          <Button
            asChild
            variant={"ghost"}
            className=" border-transparent bg-transparent p-2 hover:text-primary-foreground"
          >
            <Link href={"community"}>Community</Link>
          </Button>
          <Button
            asChild
            variant={"ghost"}
            className=" border-transparent bg-transparent p-2 hover:text-primary-foreground"
          >
            <Link href={"community"}>My Events</Link>
          </Button>
        </div>
        <div className="flex items-center gap-x-1">
          <AuthHeader />
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div className="flex sm:hidden items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Cable className=" w-6 h-6" />
          <span className="text-lg font-bold ">LinkUp Nouakchott</span>
        </div>

        <button className="p-2.5 border-2 border-none rounded-full bg-card hover:shadow-xs hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]">
          <Bell className="w-4 h-4 " />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
