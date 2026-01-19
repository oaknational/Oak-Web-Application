"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useAssignmentSearchParams() {
  const searchParams = useSearchParams();
  const [isClassroomAssignment, setIsClassroomAssignment] = useState<
    boolean | null
  >(null);
  const [classroomAssignmentChecked, setClassroomAssignmentChecked] =
    useState(false);

  const checkIsAssignment = useCallback(() => {
    const itemId = searchParams?.get("itemId");
    const itemType = searchParams?.get("itemType");

    setIsClassroomAssignment(itemType === "courseWork" && itemId !== null);
    setClassroomAssignmentChecked(true);
  }, [searchParams]);

  useEffect(() => {
    checkIsAssignment();
    return () => {
      setIsClassroomAssignment(null);
      setClassroomAssignmentChecked(false);
    };
  }, [checkIsAssignment]);

  return { isClassroomAssignment, classroomAssignmentChecked };
}
