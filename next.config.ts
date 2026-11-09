import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs/config";

const config: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/9.x/**" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "65q1es69v0.ufs.sh" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "gravatar.com" },
    ],
  },
};

const localizedConfig = createNextIntlPlugin()(config);
export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(localizedConfig, {
      org: process.env.SENTRY_ORG || "linkup-nouakchott",
      project: process.env.SENTRY_PROJECT || "javascript-nextjs",
      silent: !process.env.CI,
    })
  : localizedConfig;
