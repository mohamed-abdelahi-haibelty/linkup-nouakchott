"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  Menu,
  Sparkles,
  LayoutDashboard,
  SquareDashedMousePointer,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { NavUser } from "@/components/shared/NavUser";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATIONS } from "./AppNavbar";

const NAV_ICONS = {
  Discover: Sparkles,
  Community: SquareDashedMousePointer,
  "My Hub": FolderKanban,
  Dashboard: LayoutDashboard,
};

type Props = {
  role?: string | null;
};

function MobileNavbar({ role }: Props) {
  const { isAuthenticated, isLoading, getUser } = useKindeBrowserClient();
  const user = getUser();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const currentUser = {
    name: user?.given_name!,
    avatar: user?.picture!,
    email: user?.email!,
  };

  const isActivePath = (href: string) => pathname === href;
  const showDashboard = role === "admin" || role === "moderator";

  // Combine regular navigations with dashboard if applicable
  const allNavigations = [
    ...NAVIGATIONS,
    ...(showDashboard ? [{ title: "Dashboard", href: "/admin/events" }] : []),
  ];

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="relative h-10 w-10 rounded-lg border border-border/40 hover:bg-accent hover:border-border transition-all"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[350px] flex flex-col p-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="LinkUp Nouakchott home"
            >
              <img
                src="/linkup-logo.svg"
                alt=""
                className="h-10 w-[120px] md:w-40 md:h-12"
              />
            </Link>
          </SheetHeader>

          <nav className="flex-1 px-4  space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {allNavigations.map((item, index) => {
                const Icon =
                  NAV_ICONS[item.title as keyof typeof NAV_ICONS] || Sparkles;
                const isActive = isActivePath(item.href);
                const nextItem = allNavigations[index + 1];
                const isNextActive = nextItem && isActivePath(nextItem.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      // base styles
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 group border-dashed",
                      // border logic
                      isActive
                        ? "border border-border/50 rounded-md bg-card/60 text-primary-foreground shadow-primary/25"
                        : cn(
                            "text-muted-foreground hover:text-foreground hover:bg-accent",
                            !isNextActive && "border-b border-border/40"
                          )
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform group-hover:scale-110",
                        isActive && "text-primary-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto border-t border-border/40 p-4 bg-accent/20">
            {isLoading ? (
              <div className="h-16 animate-pulse bg-accent rounded-xl" />
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground px-2">
                  Account
                </p>
                <NavUser
                  className="w-full border-border/60 bg-background hover:bg-accent shadow-sm"
                  user={currentUser}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground px-2">
                  Get Started
                </p>
                <div className="flex flex-col gap-2">
                  <LoginLink className="w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-center bg-transparent"
                    >
                      Sign in
                    </Button>
                  </LoginLink>
                  <RegisterLink className="w-full">
                    <Button
                      size="lg"
                      variant={"outline"}
                      className="w-full justify-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                      Get started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </RegisterLink>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
