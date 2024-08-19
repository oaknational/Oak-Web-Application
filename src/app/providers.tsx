// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

if (typeof window !== "undefined") {
  posthog.init(getBrowserConfig("posthogApiKey"), {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
