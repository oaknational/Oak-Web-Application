import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";

const specialistLessonOverviewFixture = (
  partial?: Partial<SpecialistLessonOverviewData>,
): SpecialistLessonOverviewData => {
  return {
    isLegacy: true,
    lessonSlug: "specialist-lesson-1",
    lessonTitle: "Specialist lesson",
    programmeSlug: "specialist-programme",
    subjectSlug: "specialist-subject",
    subjectTitle: "Specialist subject",
    developmentStageSlug: "specialist-developmental-stage",
    developmentStageTitle: "Specialist developmental stage",
    phaseSlug: "specialist-phase",
    phaseTitle: "Specialist phase",
    isCanonical: false,
    unitTitle: "Specialist unit",
    unitSlug: "specialist-unit",
    keyLearningPoints: [
      { keyLearningPoint: "Specialist" },
      { keyLearningPoint: "Information" },
      { keyLearningPoint: "Learn" },
    ],
    additionalMaterialUrl: null,
    lessonEquipmentAndResources: null,
    supervisionLevel: null,
    contentGuidance: null,
    presentationUrl:
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp",
    isWorksheetLandscape: true,
    hasCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: ["this is a sentence", "this is another sentence"],
    hasDownloadableResources: true,
    starterQuiz: null,
    exitQuiz: null,
    expired: false,
    ...partial,
  };
};

export default specialistLessonOverviewFixture;
