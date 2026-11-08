import { getUserRole } from "@/features/users/actions/getUserRole";
import { setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import AppNavbar from "@/components/layout/AppNavbar";

async function WebsiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { user } = await getUserRole();
  const { locale } = await params;

  // Enable static rendering for this page
  setRequestLocale(locale);
  return (
    <div className="h-full">
      <AppNavbar role={user?.role} />
      <main className="min-h-screen pb-24 pt-20">
        <div className="container mx-auto px-4 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export default WebsiteLayout;
