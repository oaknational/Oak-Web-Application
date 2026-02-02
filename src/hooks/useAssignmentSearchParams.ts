import { useSearchParams } from "next/navigation";

export function useAssignmentSearchParams() {
  const searchParams = useSearchParams();

  const itemId = searchParams?.get("itemId");
  const itemType = searchParams?.get("itemType");
  const courseId = searchParams?.get("courseId");
  const attachmentId = searchParams?.get("attachmentId");
  const submissionId = searchParams?.get("submissionId");

  const isClassroomAssignment = itemType === "courseWork" && itemId !== null;

  return {
    isClassroomAssignment,
    itemId,
    courseId,
    attachmentId,
    submissionId,
  };
}
