import { constructDownloadsArray } from "./downloadUtils";

export const downloadAssetsFixture = [
  {
    exists: true,
    type: "presentation",
    ext: "pptx",
    label: "Slide deck",
    forbidden: null,
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
  {
    exists: true,
    type: "lesson-guide-pdf",
    label: "Lesson guide",
    ext: "pdf",
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
    });
    const filteredDownloads = downloads.filter(
      (download) => download.exists === true,
    );

    expect(filteredDownloads.length).toEqual(6);
  });
});
