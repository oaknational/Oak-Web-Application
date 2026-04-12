import {
  upsertCourseWorkPupilProgressArgsSchema,
  type UpsertCourseWorkPupilProgressArgs,
} from "@oaknational/google-classroom-addon/types";

import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import type { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

export type CourseWorkProgressContext = {
  submissionId: string;
  assignmentToken: string;
  courseWorkId: string;
  courseId: string;
  pupilLoginHint: string;
};

type QuizSectionResult = NonNullable<
  LessonSectionResults["starter-quiz"] | LessonSectionResults["exit-quiz"]
>;

const sanitizeCorrectAnswer = (
  correctAnswer: QuestionState["correctAnswer"],
) => {
  if (typeof correctAnswer === "string") return correctAnswer;
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.filter(
      (answer): answer is string => typeof answer === "string",
    );
  }
  return undefined;
};

const mapQuizQuestionResults = (questionResults: QuestionState[] | undefined) =>
  questionResults?.map((qr) => ({
    mode: qr.mode,
    grade: qr.grade,
    pupilAnswer: qr.pupilAnswer ?? null,
    feedback: qr.feedback,
    isPartiallyCorrect: qr.isPartiallyCorrect,
    usedHint: qr.offerHint,
    correctAnswer: sanitizeCorrectAnswer(qr.correctAnswer),
  }));

const mapQuizProgress = (quizResult: QuizSectionResult | undefined) => {
  if (!quizResult) return undefined;
  // Schema requires numQuestions > 0; omit the quiz section if it's missing
  const numQuestions = quizResult.numQuestions;
  if (!numQuestions) return undefined;
  return {
    grade: quizResult.grade ?? 0,
    numQuestions,
    isComplete: quizResult.isComplete ?? false,
    questionResults: mapQuizQuestionResults(quizResult.questionResults),
  };
};

export function mapToSubmitCourseWorkProgress(
  context: CourseWorkProgressContext,
  sectionResults: LessonSectionResults,
): UpsertCourseWorkPupilProgressArgs {
  const starterQuiz = mapQuizProgress(sectionResults["starter-quiz"]);
  const exitQuiz = mapQuizProgress(sectionResults["exit-quiz"]);

  const payload = {
    submissionId: context.submissionId,
    assignmentToken: context.assignmentToken,
    courseWorkId: context.courseWorkId,
    courseId: context.courseId,
    pupilLoginHint: context.pupilLoginHint,
    ...(starterQuiz && { starterQuiz }),
    ...(exitQuiz && { exitQuiz }),
    ...(sectionResults["video"] && {
      video: {
        played: sectionResults["video"].played,
        duration: sectionResults["video"].duration,
        timeElapsed: sectionResults["video"].timeElapsed,
        isComplete: sectionResults["video"].isComplete,
      },
    }),
    ...(sectionResults["intro"] && {
      intro: {
        worksheetAvailable: sectionResults["intro"].worksheetAvailable,
        worksheetDownloaded: sectionResults["intro"].worksheetDownloaded,
        isComplete: sectionResults["intro"].isComplete,
      },
    }),
  };

  return upsertCourseWorkPupilProgressArgsSchema.parse(payload);
}
