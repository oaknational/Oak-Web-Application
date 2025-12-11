import { LessonDownloadsListSchema } from "./lessonDownloads.schema";

export const constructDownloadsArray = (content: {
  hasSlideDeckAssetObject: boolean;
  hasStarterQuiz: boolean;
  hasExitQuiz: boolean;
  hasWorksheetAssetObject: boolean;
  hasWorksheetAnswersAssetObject: boolean;
  hasWorksheetGoogleDriveDownloadableVersion: boolean;
  hasSupplementaryAssetObject: boolean;
  hasLessonGuideObject: boolean;
  isLegacy: boolean;
}): LessonDownloadsListSchema => {
  const downloads: LessonDownloadsListSchema = [
    {
      exists: content.hasSlideDeckAssetObject,
      type: "presentation",
      ext: "pptx",
      label: "Slide deck",
      forbidden: null,
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-questions",
      label: "Starter quiz questions",
      ext: "pdf",
    },
    {
      exists: content.hasStarterQuiz,
      type: "intro-quiz-answers",
      label: "Starter quiz answers",
      ext: "pdf",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-questions",
      label: "Exit quiz questions",
      ext: "pdf",
    },
    {
      exists: content.hasExitQuiz,
      type: "exit-quiz-answers",
      label: "Exit quiz answers",
      ext: "pdf",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pdf",
      label: "Worksheet",
      ext: "pdf",
    },
    {
      exists:
        (!content.isLegacy &&
          (content.hasWorksheetAssetObject ||
            content.hasWorksheetAnswersAssetObject)) ||
        (content.isLegacy &&
          content.hasWorksheetGoogleDriveDownloadableVersion),
      type: "worksheet-pptx",
      label: "Worksheet",
      ext: "pptx",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-pdf",
      label: "Additional material",
      ext: "pdf",
    },
    {
      exists: content.hasSupplementaryAssetObject,
      type: "supplementary-docx",
      label: "Additional material",
      ext: "docx",
    },
    {
      exists: content.hasLessonGuideObject,
      type: "lesson-guide-pdf",
      label: "Lesson guide",
      ext: "pdf",
    },
  ];

  return downloads;
};
