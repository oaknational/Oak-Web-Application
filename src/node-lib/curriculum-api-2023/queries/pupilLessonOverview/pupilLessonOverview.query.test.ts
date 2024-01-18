import sdk from "../../sdk";

import { pupilLessonOverviewQuery } from "./pupilLessonOverview.query";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("pupilLessonOverview()", () => {
  it("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await pupilLessonOverviewQuery({
        ...sdk,
        pupilLessonOverview: vi.fn(() => Promise.resolve({ lesson: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  it("first lesson is returned if multiple units in response", async () => {
    const lesson = await pupilLessonOverviewQuery({
      ...sdk,
      pupilLessonOverview: vi.fn(() =>
        Promise.resolve({
          lesson: [
            {
              starterQuiz: quizQuestions,
            },
            {
              starterQuiz: [],
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
