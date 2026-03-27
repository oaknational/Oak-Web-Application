"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/compat/router";
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
    if (router && !router.isReady) return;

    checkIsAssignment();

    return () => {
      setIsClassroomAssignment(null);
      setClassroomAssignmentChecked(false);
    };
  }, [checkIsAssignment, router, router?.isReady]);

  return { isClassroomAssignment, classroomAssignmentChecked };
}
