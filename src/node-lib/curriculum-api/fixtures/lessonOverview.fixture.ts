import { LessonOverviewData } from "..";

const lessonOverviewFixture = (
  partial?: Partial<LessonOverviewData>,
): LessonOverviewData => {
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
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp;delayms=3000",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp;delayms=3000",
    isWorksheetLandscape: true,
    hasCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: ["this is a sentence", "this is another sentence"],
    hasDownloadableResources: true,
    starterQuiz: [],
    exitQuiz: [],
    expired: false,
    ...partial,
  };
};

export default lessonOverviewFixture;
