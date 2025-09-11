"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Bell, Cable, ChevronRight, LogIn, Logs, Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useScrollTop } from "@/hooks/useScrollTop";
import LanguageSwitcher from "./LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            className="bg-transparent border-transparent p-2 hover:text-primary-foreground"
          >
            <Link href={"/events"}>Discover</Link>
          </Button>
          <Button
            asChild
            variant={"ghost"}
            className=" border-transparent bg-background  p-2 hover:text-primary-foreground"
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
          {/* <Button className="bg-primary rounded-xl" variant={"ghost"}>
            <LogIn />
            Log In
          </Button> */}
          <Button className=" bg-accent border rounded-sm " variant={"ghost"}>
            <LogIn />
            Log In
          </Button>
          {/* <Button variant={"ghost"}>Sign In</Button>
          <Button className="space-x-1 rounded-full">
            <span>Try It Now</span>
            <ChevronRight />
          </Button> */}
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {/* <div className="flex sm:hidden items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cable className="text-primary" />
          <span className="text-lg font-semibold text-primary">
            LinkUp Nouakchott
          </span>
        </div>
        <Button variant={"outline"} className="">
          <Bell className="w-5 h-5" />
        </Button>
      </div> */}
      {/* MOBILE NAVIGATION */}
      <div className="flex sm:hidden items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Cable className=" w-6 h-6" />
          {/* Only show text in LTR mode to keep Arabic clean */}
          <span className="text-lg font-bold  ">LinkUp Nouakchott</span>
        </div>

        {/* Notifications button */}
        {/* <Button
          variant="ghost"
          className="p-2 border-2 border-primary bg-card shadow-sm hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Bell className="w-5 h-5 text-primary" />
        </Button> */}
        <button className="p-2.5 border-2 border-none rounded-full bg-card hover:shadow-xs hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]">
          <Bell className="w-4 h-4 " />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

{
  /* <Sheet>
          <SheetTrigger asChild>
            <Menu className="text-primary w-7 h-7 " />
          </SheetTrigger>
          <SheetContent className="pb-8" side="top">
            <SheetHeader className="border-b px-2">
              <SheetTitle className="text-primary">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col justify-start items-start gap-y-6 px-2">
              <Button
                asChild
                variant={"ghost"}
                className="border-transparent px-0 border-b border-b-primary  shadow-none"
              >
                <Link href={"/events"}>Events</Link>
              </Button>
              <Button
                variant={"ghost"}
                className="border-transparent px-0  shadow-none"
              >
                <Link href={"community"}>Community</Link>
              </Button>
            </div>
            <div className="flex flex-col items-start gap-y-6 border-t px-2">
              <Button variant={"ghost"} className="mt-6 px-0">
                Sign In
              </Button>
              <Button className="space-x-1 rounded-full w-full">
                <span>Try It Now</span>
                <ChevronRight />
              </Button>
            </div>
          </SheetContent>
        </Sheet> */
}
