import { getProceedLabel } from "./getProceedLabel";

describe("getProceedLabel", () => {
  it.each([
    [
      { isLessonComplete: true, lessonStarted: true, introIsComplete: true },
      "Lesson review",
    ],
    [
      { isLessonComplete: false, lessonStarted: true, introIsComplete: true },
      "Continue lesson",
    ],
    [
      { isLessonComplete: false, lessonStarted: false, introIsComplete: true },
      "Start lesson",
    ],
    [
      { isLessonComplete: false, lessonStarted: false, introIsComplete: false },
      "Let's get ready",
    ],
  ])("returns %s as %s", (args, expected) => {
    expect(getProceedLabel(args)).toBe(expected);
  });
});
