"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { OakGoogleClassroomProvider } from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";

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

  useEffect(() => {
    const analyticsUseCase = pathname?.includes("/pupil/")
      ? "Pupil"
      : "Teacher";
    track.classroomAddOnOpened({
      platform: "google-classroom",
      product: "google classroom addon",
      engagementIntent: "use",
      componentType: "page view",
      eventVersion: "2.0.0",
      analyticsUseCase,
      clientEnvironment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={null}>
      <GoogleClassroomProviderWrapper>
        {children}
      </GoogleClassroomProviderWrapper>
    </Suspense>
  );
}
