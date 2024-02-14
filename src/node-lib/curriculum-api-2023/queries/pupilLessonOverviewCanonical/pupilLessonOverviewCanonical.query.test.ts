import sdk from "../../sdk";
import { PupilLessonOverviewQuery } from "../../generated/sdk";

import { pupilLessonOverviewCanonicalQuery } from "./pupilLessonOverviewCanonical.query";

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
  },
): PupilLessonOverviewQuery["lesson"][0] {
  const { transcriptSentences = null, ...rest } = partial ?? {};

  return {
    ...pupilLessonOverviewFixture(rest),
    transcriptSentences,
  };
}
