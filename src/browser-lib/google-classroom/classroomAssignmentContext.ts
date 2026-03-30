import type { ClientEnvironmentValueType } from "@/browser-lib/avo/Avo";

export type ClassroomAssignmentContext = {
  courseId: string | null;
  itemId: string | null;
  attachmentId: string | null;
  submissionId: string | null;
  teacherLoginHint: string | null;
  pupilLoginHint: string | null;
  classroomAssignmentId: string | null;
  clientEnvironment: ClientEnvironmentValueType;
};

export const getClassroomAssignmentId = (
  courseId: string | null | undefined,
  itemId: string | null | undefined,
) => {
  if (!courseId || !itemId) return null;
  return `${courseId}:${itemId}`;
};

export type ClassroomProgressContext = {
  [Key in
    | "submissionId"
    | "pupilLoginHint"
    | "attachmentId"
    | "courseId"
    | "itemId"]-?: NonNullable<ClassroomAssignmentContext[Key]>;
};
