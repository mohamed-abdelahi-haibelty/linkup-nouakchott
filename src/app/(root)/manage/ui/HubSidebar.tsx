import { BookmarkPlus, Grid2x2, PenLine, Sparkles, Ticket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Host",
    url: "/hub/host",
    icon: Sparkles,
  },
  {
    title: "Attend",
    url: "/hub/attend",
    icon: Ticket,
  },
  {
    title: "Saved",
    url: "/hub/saved",
    icon: BookmarkPlus,
  },
  {
    title: "Posts",
    url: "/hub/posts",
    icon: PenLine,
  },
];

export function HubSidebar() {
  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            My Hub <Grid2x2 />
          </SidebarGroupLabel>
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
    </Sidebar>
  );
}
