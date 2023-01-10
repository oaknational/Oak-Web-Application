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
    transcript: [
      "Hello, and welcome to the lesson today.",
      "My name is Miss Masson and I will be one of the teachers teaching you on this unit, Elizabeth I: Meeting the challenge, 1558 to 1588.",
      "Today is lesson one of 30 and today's lesson focuses on answering the question, why did Elizabeth's background and character impact on her early reign?",
      "Before starting the lesson today, it would be a good idea to find a quiet space to work in, and also to have a piece of paper and a pen available.",
      "If you need to get those materials in front of you, then please pause the video now and resume when you are ready to start the lesson.",
      "My name is Miss Masson and I will be one of the teachers teaching you on this unit, Elizabeth I: Meeting the challenge, 1558 to 1588.",
      "Today is lesson one of 30 and today's lesson focuses on answering the question, why did Elizabeth's background and character impact on her early reign?",
      "Before starting the lesson today, it would be a good idea to find a quiet space to work in, and also to have a piece of paper and a pen available.",
      "If you need to get those materials in front of you, then please pause the video now and resume when you are ready to start the lesson.",
      "So this can include decimals that terminate, that means they've got a finite number of digits after the decimal point, or decimals that recur, which means there's a repeating pattern of numbers after the decimal point.",
    ],
    ...partial,
  };
};

export default teachersLessonOverviewFixture;
