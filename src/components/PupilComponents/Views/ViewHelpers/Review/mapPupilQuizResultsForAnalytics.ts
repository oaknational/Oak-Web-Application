import type { ActivityResultsSharedProperties } from "@/browser-lib/avo/Avo";
import type { QuestionsArray } from "@/context/PupilLessonQuiz";

type SummarySection = "starter-quiz" | "exit-quiz";

type PupilQuizResultsForAnalytics =
  ActivityResultsSharedProperties["pupilStarterQuiz"];

type MapPupilQuizResultsForAnalyticsArgs = {
  section: SummarySection;
  questionResults:
    | {
        grade: number;
        offerHint: boolean;
      }[]
    | undefined;
  questionsArray: QuestionsArray;
};

export const mapPupilQuizResultsForAnalytics = ({
  section,
  questionResults,
  questionsArray,
}: MapPupilQuizResultsForAnalyticsArgs): PupilQuizResultsForAnalytics => {
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
