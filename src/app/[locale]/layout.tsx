import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { extractRouterConfig } from "uploadthing/server";
import PostHogPageView from "../providers/PostHogPageView";
import { PostHogProvider } from "../providers/PostHogProvider";
import "./globals.css";

const mabry = localFont({
  src: [
    {
      path: "../../../public/fonts/mabry/MabryPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/mabry/MabryPro-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/mabry/MabryPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mabry", // optional CSS variable
});

export const metadata: Metadata = {
  title: "LinkUp Nouakchott",
  description: "Discover, host, and manage events in Nouakchott",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${mabry.variable} antialiased `}
      >
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />

        <NextIntlClientProvider>
          <PostHogProvider>
            <Toaster position="top-right" />
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
