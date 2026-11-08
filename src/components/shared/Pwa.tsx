"use client";
import { useEffect } from "react";

export default function Pwa() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/", updateViaCache: "none" })
      .catch((error: unknown) =>
        console.error("Service worker registration failed", error),
      );
  }, []);
  return null;
}
