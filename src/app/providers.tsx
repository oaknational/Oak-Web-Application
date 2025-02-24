"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { OakPupilClientProvider } from "@oaknational/oak-pupil-client";
import { OverlayProvider } from "react-aria";
import { ToastProvider } from "@/context/Toast";

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
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function OakPupilClientProviderWithClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OakPupilClientProvider
      config={{
        getLessonAttemptUrl: getBrowserConfig("oakGetLessonAttemptUrl"),
        logLessonAttemptUrl: getBrowserConfig("oakLogLessonAttemptUrl"),
        getTeacherNoteUrl: getBrowserConfig("oakGetTeacherNoteUrl"),
        addTeacherNoteUrl: getBrowserConfig("oakAddTeacherNoteUrl"),
      }}
    >
      {children}
    </OakPupilClientProvider>
  );
}

export function OverlayProviderWithClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OverlayProvider>{children}</OverlayProvider>;
}

export function ToastProviderWithClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
