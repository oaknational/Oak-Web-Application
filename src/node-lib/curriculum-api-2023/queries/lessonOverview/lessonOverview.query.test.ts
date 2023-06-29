import sdk from "../../sdk";

import lessonOverview from "./lessonOverview.query";

describe("lessonListing()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonOverview({
        ...sdk,
        lessonOverview: jest.fn(() => Promise.resolve({ lesson: [] })),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test.skip("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonOverview({
        ...sdk,
        lessonOverview: jest.fn(() =>
          Promise.resolve({
            lesson: [
              {
                programmeSlug: "programme-slug",
                unitTitle: "unit-title",
                unitSlug: "unit-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                contentGuidance: null,
                equipmentRequired: null,
                supervisionLevel: null,
                worksheetUrl: null,
                isWorksheetLandscape: false,
                hasCopyrightMaterial: false,
                videoMuxPlaybackId: null,
                videoWithSignLanguageMuxPlaybackId: null,
                transcriptSentences: null,
                hasDownloadableResources: null,
                introQuiz: [],
                exitQuiz: [],
                introQuizInfo: null,
                exitQuizInfo: null,
                expired: false,
              },
            ],
          })
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`subjectSlug`);
  });
});
