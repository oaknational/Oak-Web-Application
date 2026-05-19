import { pickProceedToNextSectionLabel } from "./pickProceedToNextSectionLabel";

describe("pickProceedToNextSectionLabel", () => {
  it.each([
    [
      { lessonStarted: true, isLessonComplete: true, sectionResults: {} },
      "Lesson review",
    ],
    [
      { lessonStarted: true, isLessonComplete: false, sectionResults: {} },
      "Continue lesson",
    ],
    [
      {
        lessonStarted: false,
        isLessonComplete: false,
        sectionResults: { intro: { isComplete: true } },
      },
      "Start lesson",
    ],
    [
      { lessonStarted: false, isLessonComplete: false, sectionResults: {} },
      "Let's get ready",
    ],
  ] as const)("returns %s for %s", (args, expected) => {
    expect(pickProceedToNextSectionLabel(args)).toBe(expected);
  });
});
