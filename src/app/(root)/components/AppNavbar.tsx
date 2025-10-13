"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { NavUser } from "@/components/shared/NavUser";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MobileNavbar from "./MobileNavbar";

export const NAVIGATIONS = [
  {
    title: "Discover",
    href: "/events",
  },
  {
    title: "Community",
    href: "/community",
  },
  {
    title: "My Events",
    href: "/my-events",
  },
];

function AppNavbar() {
  const { isAuthenticated, isLoading, getUser } = useKindeBrowserClient();
  const user = getUser();
  const pathname = usePathname();

  const currentUser = {
    name: user?.given_name!,
    avatar: user?.picture!,
    email: user?.email!,
  };

  const isActivePath = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-300" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <span className="text-primary-foreground font-bold text-lg">
                  L
                </span>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              LinkUp Nouakchott
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAVIGATIONS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActivePath(item.href)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.title}
                {isActivePath(item.href) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {isLoading ? (
            <div className="w-20 h-9 hidden md:block animate-pulse bg-accent/50 rounded-lg" />
          ) : isAuthenticated ? (
            <div className="hidden md:block">
              <NavUser user={currentUser} />
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <LoginLink>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </LoginLink>
              <RegisterLink>
                <Button
                  size="sm"
                  className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Get started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </RegisterLink>
            </div>
          )}

          <MobileNavbar />
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;
