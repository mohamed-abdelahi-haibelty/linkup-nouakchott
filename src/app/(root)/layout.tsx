import { ReactNode } from "react";
import AppNavbar from "./components/AppNavbar";
import { getUserRole } from "../actions/user/getUserRole";

async function WebsiteLayout({ children }: { children: ReactNode }) {
  const { user } = await getUserRole();
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
