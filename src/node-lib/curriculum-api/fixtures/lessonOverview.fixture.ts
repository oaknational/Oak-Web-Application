import { LessonOverviewData } from "..";

const lessonOverviewFixture = (
  partial?: Partial<LessonOverviewData>
): LessonOverviewData => {
  return {
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitTitle: "Maths unit",
    unitSlug: "maths-unit",
    keyLearningPoints: [
      { keyLearningPoint: "Lesson" },
      { keyLearningPoint: "learning" },
      { keyLearningPoint: "points" },
    ],
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
    introQuiz: [
      {
        keyStageSlug: "ks3",
        keyStageTitle: "Key stage 3",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "maths",
        unitTitle: "Maths",
        title: "what is a question",
        points: 3,
        required: true,
        choices: [
          {
            choice: "this one",
            image:
              "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
          },
          { choice: "that one", image: null },
        ],
        active: true,
        answer: "this one",
        type: "multiple choice",
        quizType: "intro",
        displayNumber: "Q1.",
        images: [
          "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
        ],
        feedbackCorrect: "weldone",
        feedbackIncorrect: "unluckey",
      },
    ],
    exitQuiz: [],
    exitQuizInfo: { title: "this quiz", questionCount: 4 },
    introQuizInfo: { title: "this quiz", questionCount: 4 },
    expired: false,
    ...partial,
  };
};

export default lessonOverviewFixture;
