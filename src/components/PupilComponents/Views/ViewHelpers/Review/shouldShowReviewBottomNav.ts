export const shouldShowReviewBottomNav = ({
  classroomAssignmentChecked,
  isClassroomAssignment,
}: {
  classroomAssignmentChecked: boolean;
  isClassroomAssignment: boolean | null | undefined;
}) => classroomAssignmentChecked && !isClassroomAssignment;
