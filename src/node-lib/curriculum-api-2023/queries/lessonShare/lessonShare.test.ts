import {
  lessonContentFixture,
  lessonDataFixture,
  multipleChoiceQuestion,
  programmeFieldsFixture,
  unitDataFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonShare from "./lessonShare.query";
import { lessonShareSchema } from "./lessonShare.schema";
import { constructShareableResources } from "./constructShareableResources";

describe("lessonShare()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonShare({
        ...sdk,
        lessonShare: jest.fn(() => Promise.resolve({ share: [], browse: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("constructShareableResources should return correct shareable resources", () => {
    const result = constructShareableResources({
      ...lessonContentFixture({
        overrides: {
          starter_quiz: null,
          exit_quiz: null,
          video_mux_playback_id: null,
          worksheet_asset_object_url: null,
        },
      }),
      expired: false,
    });

    expect(result).toHaveLength(4);
    expect(result.every((r) => r.exists === false)).toBe(true);

    const starterQuiz = result.find((r) => r.type === "intro-quiz-questions");
    expect(starterQuiz?.metadata).toBe("");
  });
  test("constructs correct metadata for shareable resources", () => {
    const result = constructShareableResources({
      ...lessonContentFixture(),
      expired: false,
    });

    expect(result).toHaveLength(4);

    const starterQuiz = result.find((r) => r.type === "intro-quiz-questions");
    expect(starterQuiz?.metadata).toBe("4 questions");

    const exitQuiz = result.find((r) => r.type === "exit-quiz-questions");
    expect(exitQuiz?.metadata).toBe("");

    const video = result.find((r) => r.type === "video");
    expect(video?.metadata).toBe("5 minutes");
  });
  test("returns the correct response", async () => {
    const res = await lessonShare({
      ...sdk,
      lessonShare: jest.fn(() =>
        Promise.resolve({
          share: [
            {
              lesson_title: "Lesson Title",
              starter_quiz: [multipleChoiceQuestion()],
              exit_quiz: null,
              video_mux_playback_id: "1",
              video_duration: "15 mins",
              worksheet_asset_object_url: "url",
              expired: false,
              lessonReleaseDate: "2025-09-29T14:00:00.000Z",
            },
          ],
          browse: [
            {
              unit_title: "Unit Title",
              is_legacy: true,
              programme_fields: programmeFieldsFixture(),
              lesson_data: lessonDataFixture(),
              programme_slug: "programme-slug",
              lesson_slug: "lesson-slug",
              unit_slug: "unit-slug",
              unit_data: unitDataFixture(),
              supplementary_data: { unit_order: 1, order_in_unit: 1 },
              lessonReleaseDate: null,
            },
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    });
    const parsed = lessonShareSchema.parse(res);
    expect(parsed).toEqual(res);
    expect(parsed.shareableResources).toHaveLength(4);
    const starterQuiz = parsed.shareableResources.find(
      (r) => r.type === "intro-quiz-questions",
    );
    expect(starterQuiz?.metadata).toBe("1 question");
  });
});
