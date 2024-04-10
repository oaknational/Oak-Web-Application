import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

const lessonOverviewFixture = (
  partial?: Partial<LessonOverviewPageData>,
): LessonOverviewPageData => {
  return {
    isLegacy: true,
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitTitle: "Maths unit",
    unitSlug: "maths-unit",
    yearTitle: "year 11",
    keyLearningPoints: [
      { keyLearningPoint: "Lesson" },
      { keyLearningPoint: "learning" },
      { keyLearningPoint: "points" },
    ],
    additionalMaterialUrl: "https://www.google.com",
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
    starterQuiz: quizQuestions,
    exitQuiz: quizQuestions,
    expired: false,
    copyrightContent: [],
    downloads: [
      { exists: true, type: "intro-quiz-answers" },
      { exists: true, type: "intro-quiz-questions" },
      { exists: true, type: "exit-quiz-answers" },
      { exists: true, type: "exit-quiz-questions" },
      { exists: true, type: "worksheet-pdf" },
      { exists: true, type: "worksheet-pptx" },
      { exists: true, type: "presentation" },
    ],
    ...partial,
  };
};

export default lessonOverviewFixture;
