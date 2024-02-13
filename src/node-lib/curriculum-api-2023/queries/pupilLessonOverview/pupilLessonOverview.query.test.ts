import sdk from "../../sdk";
import { PupilLessonOverviewQuery } from "../../generated/sdk";

import { pupilLessonOverviewQuery } from "./pupilLessonOverview.query";

import { LEGACY_COHORT, NEW_COHORT } from "@/config/cohort";
import { PupilLessonOverviewData } from "@/node-lib/curriculum-api";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";

describe("pupilLessonOverview()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(executeLessonOverviewQuery([])).rejects.toThrow(
      `Resource not found`,
    );
  });

  test("first lesson is returned if multiple units in response", async () => {
    const lesson = await executeLessonOverviewQuery([
      mockQueryLesson(),
      mockQueryLesson({
        lessonSlug: "lesson-slug-2",
        lessonTitle: "lesson-title-2",
      }),
    ]);

    expect(lesson.starterQuiz?.[0]?.questionId).toEqual(985);
  });

  describe("when the lesson is for the 2020-2023 cohort", () => {
    const mockLesson = mockQueryLesson({ lessonCohort: LEGACY_COHORT });

    test("isLegacyLicense is true", async () => {
      const lesson = await executeLessonOverviewQuery([mockLesson]);

      expect(lesson.starterQuiz?.[0]?.questionId).toEqual(985);
    });
  });

  describe("when the lesson is for the 2023-2024 cohort", () => {
    const mockLesson = mockQueryLesson({ lessonCohort: NEW_COHORT });

    test("isLegacyLicense is false", async () => {
      const lesson = await executeLessonOverviewQuery([mockLesson]);

      expect(lesson.isLegacyLicense).toBe(false);
    });
  });
});

async function executeLessonOverviewQuery(
  lesson: ReturnType<typeof mockQueryLesson>[],
) {
  return pupilLessonOverviewQuery({
    ...sdk,
    pupilLessonOverview: async () => ({ lesson }),
  })({
    lessonSlug: "lesson-slug",
    unitSlug: "unit-slug",
    programmeSlug: "programme-slug",
  });
}

/* `PupilLessonOverviewData` doesn't fit the shape of `PupilLessonOverviewQuery`
 * since we need to augment the result with the transcript from gcloud for new content.
 */
function mockQueryLesson(
  partial?: Partial<Omit<PupilLessonOverviewData, "transcriptSentences">> & {
    transcriptSentences?: string | null;
    lessonCohort?: string;
  },
): PupilLessonOverviewQuery["lesson"][0] {
  const {
    transcriptSentences = null,
    isLegacyLicense,
    lessonCohort,
    ...rest
  } = partial ?? {};

  return {
    ...pupilLessonOverviewFixture(rest),
    transcriptSentences,
    lessonCohort,
  };
}
