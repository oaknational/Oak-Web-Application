"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { OakGoogleClassroomProvider } from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";
import {
  AnalyticsUseCase,
  ComponentType,
  EngagementIntent,
  EventVersion,
  Platform,
  Product,
} from "@/browser-lib/avo/Avo";

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

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { track } = useAnalytics();
  const pathname = usePathname();
  const clientEnvironment = getClientEnvironment();
  const isPupilRoute = pathname?.includes("/classroom/pupil/") ?? false;

  useEffect(() => {
    if (isPupilRoute) return;

    track.classroomAddOnOpened({
      platform: Platform.GOOGLE_CLASSROOM,
      product: Product.GOOGLE_CLASSROOM_ADDON,
      engagementIntent: EngagementIntent.USE,
      componentType: ComponentType.PAGE_VIEW,
      eventVersion: EventVersion["2_0_0"],
      analyticsUseCase: AnalyticsUseCase.TEACHER,
      clientEnvironment,
    });
  }, [clientEnvironment, isPupilRoute, track]);

  return (
    <Suspense fallback={null}>
      <GoogleClassroomProviderWrapper>
        {children}
      </GoogleClassroomProviderWrapper>
    </Suspense>
  );
}
