"use client";

import { useSearchParams } from "next/navigation";
import { OakGoogleClassroomProvider } from "@oaknational/google-classroom-addon/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
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
