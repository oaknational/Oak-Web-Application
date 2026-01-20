"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAssignmentSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClassroomAssignment, setIsClassroomAssignment] = useState<
    boolean | null
  >(null);
  const [classroomAssignmentChecked, setClassroomAssignmentChecked] =
    useState(false);

  const checkIsAssignment = useCallback(() => {
    if (typeof window === "undefined" || !searchParams) return;
    const itemId = searchParams?.get("itemId");
    const itemType = searchParams?.get("itemType");

    setIsClassroomAssignment(itemType === "courseWork" && itemId !== null);
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
