import {
  buildActivityResultsSharedTrackingData,
  buildLessonSummaryReviewedTrackingData,
} from "./reviewTracking";

import type { TrackReviewEventArgs } from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";

const quizQuestion = (questionType: string, hint?: string | null) =>
  ({
    questionType,
    hint,
  }) as never;

describe("review tracking payload builders", () => {
  const args: TrackReviewEventArgs = {
    sectionResults: {
      "starter-quiz": {
        isComplete: true,
        grade: 1,
        numQuestions: 1,
        questionResults: [{ mode: "feedback", grade: 1, offerHint: false }],
      },
      "exit-quiz": {
        isComplete: true,
        grade: 0,
        numQuestions: 1,
        questionResults: [{ mode: "feedback", grade: 0, offerHint: true }],
      },
    },
    starterQuizQuestionsArray: [quizQuestion("multiple-choice", "hint")],
    exitQuizQuestionsArray: [quizQuestion("short-answer", null)],
  };

  it("adds per-question quiz results to lesson summary reviewed payloads", () => {
    expect(buildLessonSummaryReviewedTrackingData(args)).toEqual(
      expect.objectContaining({
        pupilStarterQuiz: [
          expect.objectContaining({
            pupilExperienceLessonActivity: "starter-quiz",
            questionType: "multiple-choice",
            questionResult: "correct",
          }),
        ],
        pupilExitQuiz: [
          expect.objectContaining({
            pupilExperienceLessonActivity: "exit-quiz",
            questionType: "short-answer",
            questionResult: "incorrect",
          }),
        ],
      }),
    );
  });

  it("adds per-question quiz results to activity results shared payloads", () => {
    expect(buildActivityResultsSharedTrackingData(args)).toEqual(
      expect.objectContaining({
        pupilStarterQuiz: [
          expect.objectContaining({
            pupilExperienceLessonActivity: "starter-quiz",
            questionType: "multiple-choice",
          }),
        ],
        pupilExitQuiz: [
          expect.objectContaining({
            pupilExperienceLessonActivity: "exit-quiz",
            questionType: "short-answer",
          }),
        ],
      }),
    );
  });
});
