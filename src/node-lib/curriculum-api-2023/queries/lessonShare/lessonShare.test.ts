import {
  lessonContentFixture,
  programmeFieldsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import lessonShare, { constructShareableResources } from "./lessonShare.query";

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

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonShare({
        ...sdk,
        lessonShare: jest.fn(() =>
          Promise.resolve({
            share: [
              {
                lesson_title: "Lesson Title",
                starter_quiz: null,
                exit_quiz: null,
                video_mux_playback_id: "1",
                video_duration: "15 mins",
                worksheet_asset_object_url: "url",
              },
            ],
            browse: [
              {
                unit_title: "Unit Title",
                is_legacy: true,
                programme_fields: programmeFieldsFixture(),
              },
            ],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`expired`);
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
});
