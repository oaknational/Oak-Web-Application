import { TeachersLessonOverviewData } from "..";

const teachersLessonOverviewFixture = (
  partial?: Partial<TeachersLessonOverviewData>
): TeachersLessonOverviewData => {
  return {
    slug: "macbeth-lesson-1",
    title: "Islamic Geometry",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    coreContent: ["Lesson", "core", "content"],
    equipmentRequired: null,
    supervisionLevel: null,
    contentGuidance: null,
    presentationUrl:
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp;delayms=3000",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp;delayms=3000",
    hasCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcript: null,
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
        choices: ["this one", "that one"],
        active: true,
        answer: "this one",
        type: "multiple choice",
        quizType: "intro",
        displayNumber:"Q1.",
        images: [
          "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
        ],
        feedbackCorrect: "weldone",
        feedbackIncorrect: "unluckey",
        choiceImages: [
          "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
        ],
      },
    ],
    exitQuiz: [],
    ...partial,
  };
};

export default teachersLessonOverviewFixture;
