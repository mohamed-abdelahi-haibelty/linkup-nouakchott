import { ReactNode } from "react";
import AppNavbar from "./components/AppNavbar";

function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full">
      <AppNavbar />
      <main className="min-h-screen pb-24 pt-20 mx-6">{children}</main>
    </div>
  );
}

export default WebsiteLayout;
