import { LessonDownloadsPageData } from "../queries/lessonDownloads/lessonDownloads.schema";

const lessonDownloadsFixtures = (
  partial?: Partial<LessonDownloadsPageData>,
): LessonDownloadsPageData => {
  return {
    expired: false,
    isLegacy: false,
    isSpecialist: false,
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
    additionalFiles: [],
    updatedAt: "2025-09-29T14:00:00.000Z",
    geoRestricted: false,
    loginRequired: false,
    ...partial,
  };
};

export default lessonDownloadsFixtures;
