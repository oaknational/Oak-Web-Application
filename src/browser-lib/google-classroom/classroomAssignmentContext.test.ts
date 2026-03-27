import {
  toClassroomProgressContext,
  type ClassroomAssignmentContext,
} from "./classroomAssignmentContext";

const fullContext: ClassroomAssignmentContext = {
  courseId: "course-123",
  itemId: "item-456",
  attachmentId: "attachment-789",
  submissionId: "submission-101",
  pupilLoginHint: "pupil@example.com",
  teacherLoginHint: "teacher@example.com",
  classroomAssignmentId: "course-123:item-456",
  clientEnvironment: "iframe",
};

describe("toClassroomProgressContext", () => {
  it("returns a progress context when all required fields are present", () => {
    expect(toClassroomProgressContext(fullContext)).toEqual({
      courseId: "course-123",
      itemId: "item-456",
      attachmentId: "attachment-789",
      submissionId: "submission-101",
      pupilLoginHint: "pupil@example.com",
    });
  });

  it("excludes fields not required for progress (teacherLoginHint, classroomAssignmentId, clientEnvironment)", () => {
    const result = toClassroomProgressContext(fullContext);
    expect(result).not.toHaveProperty("teacherLoginHint");
    expect(result).not.toHaveProperty("classroomAssignmentId");
    expect(result).not.toHaveProperty("clientEnvironment");
  });

  it.each([
    ["submissionId", { ...fullContext, submissionId: null }],
    ["pupilLoginHint", { ...fullContext, pupilLoginHint: null }],
    ["attachmentId", { ...fullContext, attachmentId: null }],
    ["courseId", { ...fullContext, courseId: null }],
    ["itemId", { ...fullContext, itemId: null }],
  ] as const)("returns null when %s is null", (_field, context) => {
    expect(toClassroomProgressContext(context)).toBeNull();
  });

  it("returns null when all required fields are null", () => {
    expect(
      toClassroomProgressContext({
        ...fullContext,
        courseId: null,
        itemId: null,
        attachmentId: null,
        submissionId: null,
        pupilLoginHint: null,
      }),
    ).toBeNull();
  });
});
