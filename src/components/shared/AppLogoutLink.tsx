"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { useAppSession } from "@/lib/use-app-session";
import type { ComponentProps } from "react";
export function AppLogoutLink(props: ComponentProps<typeof LogoutLink>) {
  const { isGuest } = useAppSession();
  if (!isGuest) return <LogoutLink {...props} />;
  return (
    <button
      className={props.className}
      onClick={async () => {
        const result = await fetch("/api/guest", { method: "DELETE" });
        if (result.ok) window.location.reload();
      }}
    >
      {props.children}
    </button>
  );
}
