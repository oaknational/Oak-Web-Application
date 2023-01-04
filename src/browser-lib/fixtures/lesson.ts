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
};

export const mockFetchLessons = (lessonSlug?: string) => {
  if (lessonSlug) {
    return lessonOverview;
  }
};
