"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (typeof window !== "undefined") {
  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";
  // Reverse proxy posthog in development to avoid localhost CORS issues in Chrome https://posthog.com/docs/advanced/proxy/nextjs
  posthog.init(getBrowserConfig("posthogApiKey"), {
    api_host: isDevelopmentBuild
      ? "/ingest"
      : getBrowserConfig("posthogApiHost"),
    ui_host: isDevelopmentBuild
      ? getBrowserConfig("posthogApiHost")
      : undefined,
    capture_pageview: false,
  });
}

export function PHProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
