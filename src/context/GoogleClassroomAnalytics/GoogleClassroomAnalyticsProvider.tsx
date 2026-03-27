"use client";

import { useEffect, useRef } from "react";
import { useGoogleClassroomAddonStore } from "@oaknational/google-classroom-addon/ui";
import { useSearchParams } from "next/navigation";
import type { StoreApi } from "zustand/vanilla";

import { createGoogleClassroomAnalyticsStore } from "./GoogleClassroomAnalyticsStore";
import { googleClassroomAnalyticsContext } from "./useGoogleClassroomAnalytics";
import type {
  GoogleClassroomAnalyticsStore,
  GoogleClassroomTrackFns,
} from "./SharedTypes";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";

export function GoogleClassroomAnalyticsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { track } = useAnalytics();
  const searchParams = useSearchParams();
  const addonCourseId = useGoogleClassroomAddonStore((state) => state.courseId);
  const addonItemId = useGoogleClassroomAddonStore((state) => state.itemId);
  const addonGoogleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );
  const courseId = addonCourseId ?? searchParams?.get("courseId") ?? undefined;
  const itemId = addonItemId ?? searchParams?.get("itemId") ?? undefined;
  const googleLoginHint =
    addonGoogleLoginHint ?? searchParams?.get("login_hint") ?? "";
  const clientEnvironment = getClientEnvironment();
  const storeRef = useRef<StoreApi<GoogleClassroomAnalyticsStore> | null>(null);

  storeRef.current ??= createGoogleClassroomAnalyticsStore({
    track: track as GoogleClassroomTrackFns,
    clientEnvironment,
    googleLoginHint,
    courseId,
    itemId,
  });

  useEffect(() => {
    storeRef.current?.getState().syncContext({
      track: track as GoogleClassroomTrackFns,
      clientEnvironment,
      googleLoginHint,
      courseId,
      itemId,
    });
  }, [track, clientEnvironment, googleLoginHint, courseId, itemId]);

  return (
    <googleClassroomAnalyticsContext.Provider value={storeRef.current}>
      {children}
    </googleClassroomAnalyticsContext.Provider>
  );
}
