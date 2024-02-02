import sdk from "../../sdk";

import { pupilLessonOverviewQuery } from "./pupilLessonOverview.query";

import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";

describe("pupilLessonOverview()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonOverviewQuery({
        ...sdk,
        pupilLessonOverview: jest.fn(() => Promise.resolve({ lesson: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("first lesson is returned if multiple units in response", async () => {
    const lesson = await pupilLessonOverviewQuery({
      ...sdk,
      pupilLessonOverview: jest.fn(() =>
        Promise.resolve({
          lesson: [
            pupilLessonOverviewFixture(),
            {
              starterQuiz: [],
              lessonSlug: "lesson-slug-2",
              lessonTitle: "lesson-title-2",
            },
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    });
    expect(lesson?.starterQuiz?.[0]?.questionId).toEqual(985);
  });
});
