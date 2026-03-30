"use client";

import { useSearchParams } from "next/navigation";
import { useGoogleClassroomAddonStore } from "@oaknational/google-classroom-addon/ui";

import { getClientEnvironment } from "@/browser-lib/google-classroom/getClientEnvironment";
import { getClassroomAssignmentId } from "@/browser-lib/google-classroom";
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

  const courseId = addonCourseId ?? searchParams?.get("courseId") ?? null;
  const itemId = addonItemId ?? searchParams?.get("itemId") ?? null;
  const attachmentId = searchParams?.get("attachmentId") ?? null;
  const googleLoginHint =
    addonGoogleLoginHint ?? searchParams?.get("login_hint") ?? "";
  const clientEnvironment = getClientEnvironment();
  const classroomAssignmentId = getClassroomAssignmentId(courseId, itemId);

  const isGoogleClassroomContext =
    Boolean(courseId) ||
    Boolean(itemId) ||
    Boolean(attachmentId) ||
    Boolean(googleLoginHint) ||
    (isClassroomAssignment === true && classroomAssignmentChecked);

  return {
    isGoogleClassroomContext,
    isClassroomAssignment,
    classroomAssignmentChecked,
    courseId,
    itemId,
    attachmentId,
    googleLoginHint: googleLoginHint ?? "",
    clientEnvironment,
    classroomAssignmentId,
  };
}
