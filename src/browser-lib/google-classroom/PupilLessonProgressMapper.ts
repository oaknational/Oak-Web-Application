import { z } from "zod";
import {
  PupilLessonProgress,
  questionResultSchema,
} from "@oaknational/google-classroom-addon/types";

import {
  LessonAttemptCamelCase,
  QuizResultCamelCase,
  QuestionResultCamelCase,
} from "@/node-lib/pupil-api/types";

// Shorthand PupilLessonProgress types
type PupilLessonProgressQuiz = PupilLessonProgress["starterQuiz"];
type PupilLessonProgressQuizQuestionResult = z.infer<
  typeof questionResultSchema
>;
type PupilLessonProgressQuizQuestionResults =
  PupilLessonProgressQuizQuestionResult[];

// Shorthand LessonAttemptCamelCase types
type LessonAttemptQuiz = QuizResultCamelCase;
type LessonAttemptQuizQuestionResult = QuestionResultCamelCase;
type LessonAttemptQuizQuestionResults = LessonAttemptQuizQuestionResult[];

type ToLessonAttemptDataArgs = {
  pupilProgress: PupilLessonProgress;
  lessonTitle: string;
  lessonSlug: string;
  subject: string;
  yearDescription: string;
};
export class PupilLessonProgressMapper {
  /**
   * Maps a PupilLessonProgress (Google Classroom) object to a LessonAttemptCamelCase
   * object which is the format used in PupilViewsResults component
   * @param pupilProgress
   * @param lessonTitle
   * @param lessonSlug
   * @param subject
   * @param yearDescription
   */
  public static toLessonAttemptData({
    pupilProgress,
    lessonTitle,
    lessonSlug,
    subject,
    yearDescription,
  }: ToLessonAttemptDataArgs): LessonAttemptCamelCase {
    return {
      // attemptId matches Google Classroom's pupilLessonProgress composite key
      attemptId: `${pupilProgress.submissionId}:${pupilProgress.attachmentId}:${pupilProgress.itemId}`,
      createdAt: pupilProgress.createdAt,
      lessonData: {
        title: lessonTitle,
        slug: lessonSlug,
      },
      browseData: {
        subject,
        yearDescription,
      },
      sectionResults: {
        intro: {
          worksheetDownloaded:
            pupilProgress.intro?.worksheetDownloaded ?? false,
          worksheetAvailable: pupilProgress.intro?.worksheetAvailable ?? false,
          isComplete: pupilProgress.intro?.isComplete ?? false,
        },
        starterQuiz: this.toLessonAttemptQuiz(pupilProgress.starterQuiz) ?? {},
        video: {
          isComplete: pupilProgress.video?.isComplete ?? false,
          played: pupilProgress.video?.played ?? false,
          duration: pupilProgress.video?.duration ?? -1,
          timeElapsed: pupilProgress.video?.timeElapsed ?? -1,
          muted: false,
          signedOpened: false,
          transcriptOpened: false,
        },
        exitQuiz: this.toLessonAttemptQuiz(pupilProgress.exitQuiz) ?? {},
      },
    };
  }

  private static toLessonAttemptQuiz(
    quiz: PupilLessonProgressQuiz,
  ): LessonAttemptQuiz | null {
    if (!quiz) return null;
    return {
      grade: quiz.grade,
      numQuestions: quiz.numQuestions,
      questionResults: this.toLessonAttemptQuestionResults(
        quiz.questionResults,
      ),
    };
  }

  private static toLessonAttemptQuestionResults(
    qrs?: PupilLessonProgressQuizQuestionResults,
  ): LessonAttemptQuizQuestionResults {
    if (!qrs) return [];
    return qrs.map(
      (
        qr: PupilLessonProgressQuizQuestionResult,
      ): LessonAttemptQuizQuestionResult => ({
        offerHint: qr.usedHint ?? false,
        grade: qr.grade,
        mode: qr.mode as LessonAttemptQuizQuestionResult["mode"],
        pupilAnswer:
          qr.pupilAnswer as LessonAttemptQuizQuestionResult["pupilAnswer"],
        feedback: qr.feedback as LessonAttemptQuizQuestionResult["feedback"],
        correctAnswer:
          qr.correctAnswer as LessonAttemptQuizQuestionResult["correctAnswer"],
        isPartiallyCorrect: qr.isPartiallyCorrect,
      }),
    );
  }
}
