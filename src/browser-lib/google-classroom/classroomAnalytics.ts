export const getClassroomAssignmentId = ({
  courseId,
  itemId,
}: {
  courseId: string;
  itemId: string;
}) => `${courseId}:${itemId}`;
