import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { DashboardSidebar } from "./ui/DashboardSidebar";
import { DashboardHeader } from "./ui/DashboardHeader";
import { setRequestLocale } from "next-intl/server";

async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering for this page
  setRequestLocale(locale);
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
