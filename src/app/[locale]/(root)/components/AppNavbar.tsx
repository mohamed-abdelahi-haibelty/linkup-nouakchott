"use client";
import { useAppSession } from "@/lib/use-app-session";

import {
  ArrowRight,
  FolderKanban,
  LayoutDashboard,
  Sparkles,
  SquareDashedMousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs";
import { NavUser } from "@/components/shared/NavUser";
import { cn } from "@/lib/utils";
import MobileNavbar from "./MobileNavbar";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export const NAVIGATIONS = [
  {
    title: "discover", // "Discover"
    href: "/events",
    icons: Sparkles,
  },
  {
    title: "community", // "Community"
    href: "/community",
    icons: SquareDashedMousePointer,
  },
  {
    title: "myHub", // "My Hub"
    href: "/manage",
    icons: FolderKanban,
  },
];

type Props = {
  role?: string | null;
};

function AppNavbar({ role }: Props) {
  const { isAuthenticated, isLoading, getUser } = useAppSession();
  const user = getUser();
  const pathname = usePathname();
  const t = useTranslations("navbar");

  const currentUser = {
    name: user?.given_name!,
    avatar: user?.picture!,
    email: user?.email!,
  };

  const isActivePath = (href: string) => pathname.startsWith(href);
  const showDashboard = role === "admin" || role === "moderator";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label={t("homeLabel")} // "LinkUp Nouakchott home"
          >
            <img
              src="/linkup-logo.svg"
              alt=""
              className="h-10 w-[120px] md:w-40 md:h-12"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAVIGATIONS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2",
                  isActivePath(item.href)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icons className="w-4 h-4" />
                {t(`nav.${item.title}`)} {/* Example: "Discover" */}
              </Link>
            ))}

            {showDashboard && (
              <Link
                href="/admin/events"
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2",
                  isActivePath("/admin")
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("nav.dashboard")} {/* "Dashboard" */}
              </Link>
            )}
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
                  {t("signIn")} {/* "Sign in" */}
                </Button>
              </LoginLink>
              <RegisterLink>
                <Button
                  size="sm"
                  className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  {t("getStarted")} {/* "Get started" */}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </RegisterLink>
            </div>
          )}

          <MobileNavbar role={role} />
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;
