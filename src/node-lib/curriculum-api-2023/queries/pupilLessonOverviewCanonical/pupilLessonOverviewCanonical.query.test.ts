import sdk from "../../sdk";

import { pupilLessonOverviewCanonicalQuery } from "./pupilLessonOverviewCanonical.query";

describe("pupilLessonOverviewCanonical()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonOverviewCanonicalQuery({
        ...sdk,
        pupilLessonOverviewCanonical: jest.fn(() =>
          Promise.resolve({ lesson: [] }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await pupilLessonOverviewCanonicalQuery({
        ...sdk,
        pupilLessonOverviewCanonical: jest.fn(() =>
          Promise.resolve({
            lesson: [{}],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`lessonSlug`);
  });
});
