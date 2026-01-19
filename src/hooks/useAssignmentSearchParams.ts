import { useSearchParams } from "next/navigation";

export function useAssignmentSearchParams() {
  const searchParams = useSearchParams();

  const itemId = searchParams?.get("itemId");
  const itemType = searchParams?.get("itemType");

  const isClassroomAssignment = itemType === "courseWork" && itemId !== null;

  return { isClassroomAssignment };
}
