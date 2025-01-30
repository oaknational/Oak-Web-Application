import { additionalFilesFixture } from "@oaknational/oak-curriculum-schema";

import {
  constructAdditionalFilesDownloads,
  constructDownloadsArray,
} from "./downloadUtils";

export const downloadAssetsFixture = [
  {
    exists: true,
    type: "presentation",
    ext: "pptx",
    label: "Slide deck",
    forbidden: null,
  },
  {
    exists: false,
    type: "lesson-guide",
    label: "Lesson guide",
    ext: "docx",
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
      isLegacy: true,
      hasAdditionalFiles: false,
      hasLessonGuide: false,
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
      isLegacy: true,
      hasAdditionalFiles: false,
      hasLessonGuide: false,
    });
    const filteredDownloads = downloads.filter(
      (download) => download.exists === true,
    );

    expect(filteredDownloads.length).toEqual(5);
  });
});

describe("construct additional file downloads", () => {
  it("constructs additional file downloads correctly", () => {
    const constructedFileDownloads = constructAdditionalFilesDownloads(
      additionalFilesFixture(),
    );
    expect(constructedFileDownloads).toEqual([
      {
        exists: true,
        type: "additional-file-0",
        label: "Sample File 1",
        ext: "jpg",
      },
      {
        exists: true,
        type: "additional-file-1",
        label: "Sample File 2",
        ext: "mp4",
      },
    ]);
  });
});
