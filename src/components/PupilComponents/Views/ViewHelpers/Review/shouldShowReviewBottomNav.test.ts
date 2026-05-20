import { shouldShowReviewBottomNav } from "./shouldShowReviewBottomNav";

describe("shouldShowReviewBottomNav", () => {
  it.each([
    [{ classroomAssignmentChecked: true, isClassroomAssignment: false }, true],
    [{ classroomAssignmentChecked: true, isClassroomAssignment: null }, true],
    [{ classroomAssignmentChecked: true, isClassroomAssignment: true }, false],
    [
      { classroomAssignmentChecked: false, isClassroomAssignment: false },
      false,
    ],
  ] as const)("returns %s for %s", (args, expected) => {
    expect(shouldShowReviewBottomNav(args)).toBe(expected);
  });
});
