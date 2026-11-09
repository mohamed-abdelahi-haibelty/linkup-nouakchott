"use client";
import { useAppSession } from "@/lib/use-app-session";

import { Button } from "@/components/ui/button";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { AppLogoutLink } from "./AppLogoutLink";


import { LogIn, LogOut } from "lucide-react";

function AuthHeader() {
  const { isAuthenticated } = useAppSession();

  if (isAuthenticated) {
    return (
      <Button
        asChild
        className=" bg-accent border rounded-sm "
        variant={"ghost"}
      >
        <AppLogoutLink postLogoutRedirectURL="/events">
          Log Out
          <LogOut />
        </AppLogoutLink>
      </Button>
    );
  }
  return (
    <Button asChild className=" bg-accent border rounded-sm " variant={"ghost"}>
      <LoginLink>
        <LogIn />
        Log In
      </LoginLink>
    </Button>
  );
}

export default AuthHeader;
