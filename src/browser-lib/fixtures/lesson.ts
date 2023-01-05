import { LessonOverview } from "../../pages/beta/teachers/lessons/[lessonSlug]";

export const lessonOverview: LessonOverview = {
  lessonTitle:
    "macbeth lesson 1 and a very very very long unit title that should wrap around nicely",
  lessonSlug: "macbeth-lesson-1",
  keyStageTitle: "Key stage 4",
  keyStageSlug: "ks4",
  subjectSlug: "english",
  subjectTitle: "English",
  equipmentRequired: "Scissors, photos or pictures of holidays, glue.",
  supervisionLevel: "Adult supervision recommended.",
  contentGuidance: "Equipment requiring safe usage.",
  coreContent: [
    "To learn an outline of Elizabeth's background, her birth to Anne Boleyn and the influence this had on her governance.",
    "How her background influenced her policy towards: Ministers, government, religion, marriage.",
  ],
  video: "BOO5xy01fO1FGEJfFsYn02zoyVzdDVAlkapKQ00IRFdIZw",
  signLanguageVideo: "E800MxPyXVXBg019TwsbP00268g1ezbSilJKYApdS5UKBY",
  presentation:
    "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp;delayms=3000",
  worksheet:
    "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp;delayms=3000&slide=id.g90d231e0cb_0_5",
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
};

export const mockFetchLessons = (lessonSlug?: string) => {
  if (lessonSlug) {
    return lessonOverview;
  }
};
