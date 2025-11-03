import { BrickWall, HeartHandshake, ScanFace, Ticket } from "lucide-react";

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
import { DashboardUser } from "./DashboardUser";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: BrickWall,
  },
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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Linkup Nouakchott</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
