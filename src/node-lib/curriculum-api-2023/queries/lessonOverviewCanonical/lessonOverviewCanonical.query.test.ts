import sdk from "../../sdk";

import lessonOverviewCanonical from "./lessonOverviewCanonical.query";

describe("lessonOverviewCanonical()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonOverviewCanonical({
        ...sdk,
        lessonOverviewCanonical: jest.fn(() => Promise.resolve({ lesson: [] })),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("should combine lessons to create pathways list as a property", async () => {
    const originalLessonBase = {
      isLegacy: false,
      lessonSlug: "lesson-slug",
      lessonTitle: "lesson-title",
      additionalMaterialUrl: "supplementary-assets-url",
      supervisionLevel: "supervision-level",
      presentationUrl: "presentation-url",
      worksheetUrl: "worksheet-url",
      transcriptSentences: null,
      videoMuxPlaybackId: "video-mux-playback-id",
      videoWithSignLanguageMuxPlaybackId:
        "video-with-sign-language-mux-playback-id",
      hasDownloadableResources: false,
    };
    const lesson = await lessonOverviewCanonical({
      ...sdk,
      lessonOverviewCanonical: jest.fn(() =>
        Promise.resolve({
          lesson: [
            {
              ...originalLessonBase,
              programmeSlug: "secondary-ks3-combined-science",
              unitSlug: "cells-variant-1",
              unitTitle: "Cells variant 1",
              subjectSlug: "combined-science",
              subjectTitle: "Combined Science",
              keyStageSlug: "ks3",
              keyStageTitle: "Key-stage 3",
            },
            {
              ...originalLessonBase,
              programmeSlug: "secondary-ks4-biology",
              unitSlug: "cells-variant-2",
              unitTitle: "Cells variant 2",
              subjectSlug: "Biology",
              subjectTitle: "biology",
              keyStageSlug: "ks4",
              keyStageTitle: "Key-stage 4",
            },
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
    });
    expect(lesson).toEqual({
      ...originalLessonBase,
      pathways: [
        {
          programmeSlug: "secondary-ks3-combined-science",
          unitSlug: "cells-variant-1",
          unitTitle: "Cells variant 1",
          keyStageSlug: "ks3",
          keyStageTitle: "Key-stage 3",
          subjectSlug: "combined-science",
          subjectTitle: "Combined Science",
        },
        {
          programmeSlug: "secondary-ks4-biology",
          unitSlug: "cells-variant-2",
          unitTitle: "Cells variant 2",
          keyStageSlug: "ks4",
          keyStageTitle: "Key-stage 4",
          subjectSlug: "Biology",
          subjectTitle: "biology",
        },
      ],
    });
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonOverviewCanonical({
        ...sdk,
        lessonOverviewCanonical: jest.fn(() =>
          Promise.resolve({
            lesson: [{}],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`subjectSlug`);
  });
});
