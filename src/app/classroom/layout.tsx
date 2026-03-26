"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { OakGoogleClassroomProvider } from "@oaknational/google-classroom-addon/ui";

import { AnalyticsUseCase } from "@/browser-lib/avo/Avo";
import {
  GoogleClassroomAnalyticsProvider,
  useGoogleClassroomAnalytics,
} from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

function GoogleClassroomProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("courseId") ?? "";
  const itemId = searchParams?.get("itemId") ?? "";
  const addOnToken = searchParams?.get("addOnToken") ?? "";

  return (
    <OakGoogleClassroomProvider
      courseId={courseId}
      itemId={itemId}
      addOnToken={addOnToken}
    >
      {children}
    </OakGoogleClassroomProvider>
  );
}

function ClassroomLayoutAnalytics({ isPupilRoute }: { isPupilRoute: boolean }) {
  const trackAddOnOpened = useGoogleClassroomAnalytics(
    (state) => state.trackAddOnOpened,
  );

  useEffect(() => {
    if (isPupilRoute) return;

    trackAddOnOpened({
      analyticsUseCase: AnalyticsUseCase.TEACHER,
    });
  }, [isPupilRoute, trackAddOnOpened]);

  return null;
}

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isPupilRoute = pathname?.includes("/classroom/pupil/") ?? false;

  return (
    <Suspense fallback={null}>
      <GoogleClassroomProviderWrapper>
        <GoogleClassroomAnalyticsProvider>
          <ClassroomLayoutAnalytics isPupilRoute={isPupilRoute} />
          {children}
        </GoogleClassroomAnalyticsProvider>
      </GoogleClassroomProviderWrapper>
    </Suspense>
  );
}
