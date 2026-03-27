"use client";

import { useSearchParams } from "next/navigation";
import { useGoogleClassroomAddonStore } from "@oaknational/google-classroom-addon/ui";

import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";

export function useGoogleClassroomContext() {
  const searchParams = useSearchParams();
  const addonCourseId = useGoogleClassroomAddonStore((state) => state.courseId);
  const addonItemId = useGoogleClassroomAddonStore((state) => state.itemId);
  const addonGoogleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );

  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();

  const courseId = addonCourseId ?? searchParams?.get("courseId") ?? undefined;
  const itemId = addonItemId ?? searchParams?.get("itemId") ?? undefined;
  const googleLoginHint =
    addonGoogleLoginHint ?? searchParams?.get("login_hint") ?? "";

  const isGoogleClassroomContext =
    Boolean(courseId) ||
    Boolean(itemId) ||
    Boolean(googleLoginHint) ||
    (isClassroomAssignment === true && classroomAssignmentChecked);

  return {
    isGoogleClassroomContext,
    courseId,
    itemId,
    googleLoginHint: googleLoginHint ?? "",
  };
}
