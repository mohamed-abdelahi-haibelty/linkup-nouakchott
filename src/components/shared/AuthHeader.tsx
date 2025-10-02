"use client";

import { Button } from "@/components/ui/button";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogIn, LogOut } from "lucide-react";

function AuthHeader() {
  const { isAuthenticated } = useKindeBrowserClient();

  if (isAuthenticated) {
    return (
      <Button
        asChild
        className=" bg-accent border rounded-sm "
        variant={"ghost"}
      >
        <LogoutLink postLogoutRedirectURL="/events">
          Log Out
          <LogOut />
        </LogoutLink>
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
