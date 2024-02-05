import sdk from "../../sdk";

import lessonOverview from "./lessonOverview.query";

import { NEW_COHORT } from "@/config/cohort";

describe("lessonOverview()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonOverview({
        ...sdk,
        lessonOverview: jest.fn(() => Promise.resolve({ lesson: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
        lessonCohort: NEW_COHORT,
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("first lesson is returned if multiple units in response", async () => {
    const lesson = await lessonOverview({
      ...sdk,
      lessonOverview: jest.fn(() =>
        Promise.resolve({
          lesson: [
            {
              programmeSlug: "programme-slug-0",
              unitSlug: "unit-slug",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              lessonSlug: "lesson-slug",
              lessonTitle: "lesson-title",
              additionalMaterialUrl: "supplementary-assets-url",
              supervisionLevel: "supervision-level",
              presentationUrl: "presentation-url",
              worksheetUrl: "worksheet-url",
              videoWithSignLanguage: "video-with-sign-language",
              transcriptSentences: null,
              videoMuxPlaybackId: "video-mux-playback-id",
              videoWithSignLanguageMuxPlaybackId:
                "video-with-sign-language-mux-playback-id",
              hasDownloadableResources: false,
            },
            {
              programmeSlug: "programme-slug-1",
              unitSlug: "unit-slug",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              lessonSlug: "lesson-slug",
              yearTitle: "year-title",
              lessonTitle: "lesson-title",
              supervisionLevel: "supervision-level",
              presentationUrl: "presentation-url",
              worksheetUrl: "worksheet-url",
              videoWithSignLanguage: "video-with-sign-language",
              transcriptSentences: null,
              videoMuxPlaybackId: "video-mux-playback-id",
              videoWithSignLanguageMuxPlaybackId:
                "video-with-sign-language-mux-playback-id",
              hasDownloadableResources: false,
            },
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
      lessonCohort: NEW_COHORT,
    });
    expect(lesson.programmeSlug).toEqual("programme-slug-0");
  });

  test("throws a Zod error if the response is invalid", async () => {
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
                additionalMaterialUrl: "supplementary-assets-url",
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
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
        lessonCohort: NEW_COHORT,
      });
    }).rejects.toThrow(`subjectSlug`);
  });
});
