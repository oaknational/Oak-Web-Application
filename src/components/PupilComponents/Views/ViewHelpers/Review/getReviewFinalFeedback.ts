import { LessonSectionResults } from "@/context/PupilLessonProgress";

export const getReviewFinalFeedback = (
  isLessonComplete: boolean,
  sectionResults: LessonSectionResults,
): string => {
  if (!isLessonComplete) {
    return "Well done, you're Oaking it!";
  }

  const starterQuizPercentage =
    sectionResults["starter-quiz"]?.grade &&
    sectionResults["starter-quiz"]?.numQuestions
      ? sectionResults["starter-quiz"].grade /
        sectionResults["starter-quiz"].numQuestions
      : 1;
  const exitQuizPercentage =
    sectionResults["exit-quiz"]?.grade &&
    sectionResults["exit-quiz"]?.numQuestions
      ? sectionResults["exit-quiz"].grade /
        sectionResults["exit-quiz"].numQuestions
      : 1;
  const totalPercentage = (starterQuizPercentage + exitQuizPercentage) / 2;

  return totalPercentage >= 0.999
    ? "Fantastic job - well done!"
    : "Great effort!";
};
