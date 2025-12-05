import { constructDownloadsArray } from "./downloadUtils";

const mockGetLessonDownloadResourcesExistence = jest.fn(() =>
  Promise.resolve({
    resources: [
      ["presentation", { exists: true }],
      ["intro-quiz-questions", { exists: true }],
      ["intro-quiz-answers", { exists: true }],
      ["exit-quiz-questions", { exists: true }],
      ["exit-quiz-answers", { exists: true }],
      ["worksheet-pdf", { exists: true }],
      ["worksheet-pptx", { exists: true }],
      ["supplementary-pdf", { exists: true }],
      ["supplementary-docx", { exists: true }],
      ["lesson-guide-pdf", { exists: true }],
    ],
  }),
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    getLessonDownloadResourcesExistence: () =>
      mockGetLessonDownloadResourcesExistence(),
  }),
);
export const downloadAssetsFixture = [
  {
    exists: true,
    type: "presentation",
    ext: "pptx",
    label: "Slide deck",
    forbidden: null,
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "intro-quiz-questions",
    label: "Starter quiz questions",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "intro-quiz-answers",
    label: "Starter quiz answers",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "exit-quiz-questions",
    label: "Exit quiz questions",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "exit-quiz-answers",
    label: "Exit quiz answers",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "worksheet-pdf",
    label: "Worksheet",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "worksheet-pptx",
    label: "Worksheet",
    ext: "pptx",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "supplementary-pdf",
    label: "Additional material",
    ext: "pdf",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "supplementary-docx",
    label: "Additional material",
    ext: "docx",
    inGcsBucket: true,
  },
  {
    exists: true,
    type: "lesson-guide-pdf",
    label: "Lesson guide",
    ext: "pdf",
    inGcsBucket: true,
  },
];

describe("constructDownloadsArray()", () => {
  test("constructs correct downloadable resource", async () => {
    const downloads = await constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: true,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: true,
      hasLessonGuideObject: true,
      isLegacy: true,
      lessonSlug: "test-slug",
    });
    expect(downloads).toEqual(downloadAssetsFixture);
  });
  test("has correct number of resources available for download", async () => {
    const downloads = await constructDownloadsArray({
      hasSlideDeckAssetObject: true,
      hasStarterQuiz: true,
      hasExitQuiz: false,
      hasWorksheetAssetObject: true,
      hasWorksheetAnswersAssetObject: true,
      hasWorksheetGoogleDriveDownloadableVersion: true,
      hasSupplementaryAssetObject: false,
      hasLessonGuideObject: true,
      isLegacy: true,
      lessonSlug: "test-slug",
    });
    const filteredDownloads = downloads.filter(
      (download) => download.exists === true,
    );

    expect(filteredDownloads.length).toEqual(6);
  });
});
