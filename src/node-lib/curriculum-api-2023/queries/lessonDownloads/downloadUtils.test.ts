import { constructDownloadsArray } from "./downloadUtils";

export const downloadAssetsFixture = [
  {
    exists: true,
    type: "lesson-guide-pdf",
    label: "Lesson guide",
    ext: "pdf",
  },
  {
    exists: true,
    type: "lesson-guide-docx",
    label: "Lesson guide",
    ext: "docx",
  },
  {
    exists: true,
    type: "presentation",
    ext: "pptx",
    label: "Slide deck",
    forbidden: null,
  },
  {
    exists: true,
    type: "intro-audio-clips",
    ext: "mp3",
    label: "Keywords",
  },
  {
    exists: true,
    type: "cycle-1-audio-clips",
    ext: "mp3",
    label: "Cycle 1",
  },
  {
    exists: true,
    type: "cycle-2-audio-clips",
    ext: "mp3",
    label: "Cycle 2",
  },
  {
    exists: true,
    type: "cycle-3-audio-clips",
    ext: "mp3",
    label: "Cycle 3",
  },
  {
    exists: true,
    type: "cycle-4-audio-clips",
    ext: "mp3",
    label: "Cycle 4",
  },
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pdf",
    label: "Worksheet",
    ext: "pdf",
  },
  {
    exists: true,
    type: "worksheet-pptx",
    label: "Worksheet",
    ext: "pptx",
  },
  {
    exists: true,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
  },
  {
    exists: true,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
  },
];

describe("constructDownloadsArray()", () => {
  test("constructs correct downloadable resource", () => {
    const downloads = constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: true,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: true,
      hasLessonGuideObject: true,
      isLegacy: true,
      mediaClips: {
        hasIntro: true,
        hasCycle1: true,
        hasCycle2: true,
        hasCycle3: true,
        hasCycle4: true,
      },
    });
    expect(downloads).toEqual(downloadAssetsFixture);
  });
  test("has correct number of resources available for download", () => {
    const downloads = constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: false,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: false,
      hasLessonGuideObject: true,
      isLegacy: true,
      mediaClips: {
        hasIntro: true,
        hasCycle1: true,
        hasCycle2: true,
        hasCycle3: true,
        hasCycle4: true,
      },
    });
    const filteredDownloads = downloads.filter(
      (download) => download.exists === true,
    );

    expect(filteredDownloads).toHaveLength(12);
  });
  test.each([true, false])(
    "sets exists: %s on both lesson guide pdf and docx from hasLessonGuideObject",
    (hasLessonGuideObject) => {
      const downloads = constructDownloadsArray({
        hasSlideDeckAssetObject: true,
        hasStarterQuiz: true,
        hasExitQuiz: true,
        hasWorksheetAssetObject: true,
        hasWorksheetAnswersAssetObject: true,
        hasWorksheetGoogleDriveDownloadableVersion: true,
        hasSupplementaryAssetObject: true,
        hasLessonGuideObject,
        isLegacy: false,
        mediaClips: {
          hasIntro: true,
          hasCycle1: true,
          hasCycle2: true,
          hasCycle3: true,
          hasCycle4: true,
        },
      });
      const lessonGuides = downloads.filter((d) =>
        d.type.startsWith("lesson-guide"),
      );

      expect(lessonGuides).toEqual([
        {
          exists: hasLessonGuideObject,
          type: "lesson-guide-pdf",
          label: "Lesson guide",
          ext: "pdf",
        },
        {
          exists: hasLessonGuideObject,
          type: "lesson-guide-docx",
          label: "Lesson guide",
          ext: "docx",
        },
      ]);
    },
  );
});
