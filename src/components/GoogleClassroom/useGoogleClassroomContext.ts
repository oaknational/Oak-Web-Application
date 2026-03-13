"use client";

import { useGoogleClassroomAddonStore } from "@oaknational/google-classroom-addon/ui";

import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";

export function useGoogleClassroomContext() {
  const courseId = useGoogleClassroomAddonStore((state) => state.courseId);
  const itemId = useGoogleClassroomAddonStore((state) => state.itemId);
  const googleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );

  const { isClassroomAssignment, classroomAssignmentChecked } =
    useAssignmentSearchParams();

  const isGoogleClassroomContext =
    Boolean(courseId) ||
    (isClassroomAssignment === true && classroomAssignmentChecked);

  return {
    isGoogleClassroomContext,
    courseId,
    itemId,
    googleLoginHint: googleLoginHint ?? "",
  };
}
