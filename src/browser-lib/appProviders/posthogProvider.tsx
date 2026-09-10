"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { getPosthogInitConfig } from "@/browser-lib/posthog/getPosthogInitConfig";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (typeof window !== "undefined") {
  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";
  // Reverse proxy posthog in development to avoid localhost CORS issues in Chrome https://posthog.com/docs/advanced/proxy/nextjs
  posthog.init(
    getBrowserConfig("posthogApiKey"),
    getPosthogInitConfig({
      apiHost: isDevelopmentBuild
        ? "/ingest"
        : getBrowserConfig("posthogApiHost"),
      uiHost: isDevelopmentBuild
        ? getBrowserConfig("posthogApiHost")
        : undefined,
    }),
  );
}

export function PHProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
