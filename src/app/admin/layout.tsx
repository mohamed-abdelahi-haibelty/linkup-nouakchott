import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { DashboardSidebar } from "./ui/DashboardSidebar";
import { DashboardHeader } from "./ui/DashboardHeader";

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="container mx-auto px-4 lg:px-8">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
