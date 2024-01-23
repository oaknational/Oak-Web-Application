import { SpecialistLessonOverviewData } from "./SpecialistLesson.view";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const lessonOverviewFixture = (
  partial?: Partial<SpecialistLessonOverviewData>,
): SpecialistLessonOverviewData => {
  return {
    isLegacy: true,
    lessonSlug: "specialist-lesson-1",
    lessonTitle: "Speccialist lesson",
    programmeSlug: "specialist-programme",
    subjectSlug: "specialist-subject",
    subjectTitle: "Specialist subject",
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
    starterQuiz: quizQuestions,
    exitQuiz: quizQuestions,
    expired: false,
    ...partial,
  };
};

export default lessonOverviewFixture;
