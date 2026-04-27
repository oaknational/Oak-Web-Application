import { LessonSummaryReviewedProperties } from "@/browser-lib/avo/Avo";
import { QuestionsArray } from "@/context/PupilLessonQuiz";

type SummarySection = "starter-quiz" | "exit-quiz";

export const mapLessonSummaryQuizResults = ({
  section,
  questionResults,
  questionsArray,
}: {
  section: SummarySection;
  questionResults:
    | {
        grade: number;
        offerHint: boolean;
      }[]
    | undefined;
  questionsArray: QuestionsArray;
}): LessonSummaryReviewedProperties["pupilStarterQuiz"] => {
  if (!questionResults) return undefined;

  return questionResults.map((result, index) => {
    return {
      pupilExperienceLessonActivity: section,
      questionNumber: index + 1,
      questionType: questionsArray[index]?.questionType ?? "",
      questionResult: result.grade === 1 ? "correct" : "incorrect",
      hintOffered: Boolean(questionsArray[index]?.hint),
      hintAccessed: result.offerHint,
      activityTimeSpent: 0,
    };
  });
};
