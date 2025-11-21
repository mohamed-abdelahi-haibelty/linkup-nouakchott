"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getFallback } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { EllipsisVertical, LogOut } from "lucide-react";

export function DashboardUser() {
  const { isMobile } = useSidebar();
  const { isAuthenticated, isLoading, getUser } = useKindeBrowserClient();
  const user = getUser();

  if (!isAuthenticated) {
    return;
  }

  const currentUser = {
    name: user?.given_name!,
    avatar: user?.picture!,
    email: user?.email!,
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isLoading ? (
          <div className="w-20 h-9 hidden md:block animate-pulse bg-accent/50 rounded-lg" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getFallback(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {currentUser.email}
                  </span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {getFallback(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {currentUser.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
