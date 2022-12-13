import { LessonOverview } from "../../pages/beta/teachers/lessons/[lessonSlug]";

export const lessonOverview: LessonOverview = {
  lessonTitle:
    "macbeth lesson 1 and a very very very long unit title that should wrap around nicely",
  lessonSlug: "macbeth-lesson-1",
  keyStageTitle: "Key stage 4",
  keyStageSlug: "KS4",
  subjectSlug: "english",
  subjectTitle: "English",
  equiptmentRequired: "Scissors, photos or pictures of holidays, glue.",
  supervisionLevel: "Adult supervision recommended.",
  contentGuidance: "Equipment requiring safe usage.",
  coreContent: [
    "To learn an outline of Elizabeth's background, her birth to Anne Boleyn and the influence this had on her governance.",
    "How her background influenced her policy towards: Ministers, government, religion, marriage.",
  ],
};

export const mockFetchLessons = (lessonSlug?: string) => {
  if (lessonSlug) {
    return lessonOverview;
  }
};
