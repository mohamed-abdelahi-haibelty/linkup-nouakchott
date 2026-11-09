import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/features/admin/components/DashboardHeader";
import { DashboardSidebar } from "@/features/admin/components/DashboardSidebar";
import { setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";

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
