import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync } from "fs";
import { createHash } from "crypto";

// 1) Create the next-intl plugin
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/**", // allow any style + seed + size
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "65q1es69v0.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
    ],
  },
  /* other config options */
};

export function getFileHash(filePath: string) {
  const buffer = readFileSync(filePath);
  const hash = createHash("md5").update(buffer).digest("hex");
  return hash;
}

const intlConfig = withNextIntl(nextConfig);

const sentryConfig =
  process.env.NODE_ENV === "production"
    ? withSentryConfig(intlConfig, {
        org: "linkup-nouakchott",
        project: "javascript-nextjs",
        silent: !process.env.CI,
        widenClientFileUpload: true,
        disableLogger: true,
        automaticVercelMonitors: true,
      })
    : intlConfig;

const pwaConfig = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    additionalManifestEntries: [
      {
        url: "/custom-sw.js",
        revision: getFileHash("public/custom-sw.js"),
      },
    ],
    // Import the custom service worker
    importScripts: ["/custom-sw.js"],
  },
})(sentryConfig as any);

export default pwaConfig;
