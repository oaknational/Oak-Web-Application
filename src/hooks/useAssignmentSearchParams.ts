"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isClassroomAssignment as checkIsClassroom } from "@oaknational/google-classroom-addon/ui";

export function useAssignmentSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClassroomAssignment, setIsClassroomAssignment] = useState<
    boolean | null
  >(null);
  const [classroomAssignmentChecked, setClassroomAssignmentChecked] =
    useState(false);

  const checkIsAssignment = useCallback(() => {
    if (!globalThis?.window || !searchParams) return;

    setIsClassroomAssignment(checkIsClassroom(searchParams));
    setClassroomAssignmentChecked(true);
  }, [searchParams]);

  useEffect(() => {
    if (router.isReady) checkIsAssignment();
    return () => {
      setIsClassroomAssignment(null);
      setClassroomAssignmentChecked(false);
    };
  }, [checkIsAssignment, router]);

  return { isClassroomAssignment, classroomAssignmentChecked };
}
