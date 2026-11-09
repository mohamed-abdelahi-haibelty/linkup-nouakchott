"use client";

import { HeartHandshake, ScanFace, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DashboardUser } from "@/features/admin/components/DashboardUser";
import Link from "next/link";

const items = [
  {
    title: "Events",
    url: "/admin/events",
    icon: Ticket,
  },
  {
    title: "Community",
    url: "/admin/community",
    icon: HeartHandshake,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: ScanFace,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Linkup Nouakchott</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DashboardUser />
      </SidebarFooter>
    </Sidebar>
  );
}
