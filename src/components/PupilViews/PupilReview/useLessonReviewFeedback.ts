import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

export const useLessonReviewFeedback = (
  isLessonComplete: boolean,
  lessonEngineState: LessonSectionResults,
) => {
  if (!isLessonComplete) {
    return {
      finalFeedback: "Well done, you're Oaking it!",
    };
  }

  const starterQuizPercentage =
    lessonEngineState["starter-quiz"] &&
    lessonEngineState["starter-quiz"].grade &&
    lessonEngineState["starter-quiz"].numQuestions
      ? lessonEngineState["starter-quiz"].grade /
        lessonEngineState["starter-quiz"].numQuestions
      : 1;

  const exitQuizPercentage =
    lessonEngineState["exit-quiz"] &&
    lessonEngineState["exit-quiz"].grade &&
    lessonEngineState["exit-quiz"].numQuestions
      ? lessonEngineState["exit-quiz"].grade /
        lessonEngineState["exit-quiz"].numQuestions
      : 1;

  const totalPercentage = (starterQuizPercentage + exitQuizPercentage) / 2;

  const finalFeedback =
    totalPercentage >= 0.999 ? "Fantastic job - well done!" : "Great effort!";

  return {
    finalFeedback,
  };
};
