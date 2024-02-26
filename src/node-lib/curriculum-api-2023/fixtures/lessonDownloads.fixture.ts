import { LessonDownloadsPageData } from "../queries/lessonDownloads/lessonDownloads.schema";

const lessonDownloadsFixture2023 = (
  partial?: Partial<LessonDownloadsPageData>,
): LessonDownloadsPageData => {
  return {
    isLegacy: false,
    lessonCohort: "2023-2024",
    lessonSlug: "transverse-waves",
    lessonTitle: "Transverse waves",
    programmeSlug: "combined-science-secondary-ks4-foundation-edexcel",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "combined-science",
    subjectTitle: "Combined Science",
    unitSlug: "measuring-waves",
    unitTitle: "Measuring waves",
    tierSlug: "foundation",
    tierTitle: "Foundation",
    examBoardSlug: "edexcel",
    examBoardTitle: "Edexcel",
    hasDownloadableResources: true,
    nextLessons: [
      {
        lessonSlug: "representing-transverse-waves",
        lessonTitle: "Representing transverse waves",
      },
      {
        lessonSlug: "representing-longitudinal-waves",
        lessonTitle: "Representing longitudinal waves",
      },
      { lessonSlug: "oscilloscope", lessonTitle: "Oscilloscope" },
    ],
    downloads: [
      {
        type: "exit-quiz-questions",
        exists: true,
        label: "Exit quiz questions",
        ext: "PDF",
      },
      {
        type: "exit-quiz-answers",
        exists: true,
        label: "Exit quiz answers",
        ext: "PDF",
      },
    ],
    ...partial,
  };
};

export default lessonDownloadsFixture2023;
