import { CourseWorkPupilProgress } from "@oaknational/google-classroom-addon/types";

import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import { QuestionResultCamelCase } from "@/node-lib/pupil-api/types/lessonAttempt";

export function mapToAttemptData(
  progress: CourseWorkPupilProgress,
  lessonTitle: string,
  lessonSlug: string,
  subject: string,
  yearDescription: string,
): LessonAttemptCamelCase {
  const mapQuiz = (quiz?: CourseWorkPupilProgress["starterQuiz"]) => {
    if (!quiz) return {};
    return {
      grade: quiz.grade,
      numQuestions: quiz.numQuestions,
      questionResults: (quiz.questionResults ?? []).map(
        (qr): QuestionResultCamelCase => ({
          offerHint: qr.usedHint ?? false,
          grade: qr.grade,
          mode: qr.mode as QuestionResultCamelCase["mode"],
          pupilAnswer: qr.pupilAnswer as QuestionResultCamelCase["pupilAnswer"],
          feedback: qr.feedback as QuestionResultCamelCase["feedback"],
          correctAnswer:
            qr.correctAnswer as QuestionResultCamelCase["correctAnswer"],
          isPartiallyCorrect: qr.isPartiallyCorrect,
        }),
      ),
    };
  };

  return {
    attemptId: `${progress.submissionId}:${progress.assignmentToken}`,
    createdAt: progress.createdAt,
    lessonData: { title: lessonTitle, slug: lessonSlug },
    browseData: { subject, yearDescription },
    sectionResults: {
      intro: {
        worksheetDownloaded: progress.intro?.worksheetDownloaded ?? false,
        worksheetAvailable: progress.intro?.worksheetAvailable ?? false,
        isComplete: progress.intro?.isComplete ?? false,
      },
      "starter-quiz": mapQuiz(progress.starterQuiz),
      video: {
        isComplete: progress.video?.isComplete ?? false,
        played: progress.video?.played ?? false,
        duration: progress.video?.duration ?? -1,
        timeElapsed: progress.video?.timeElapsed ?? -1,
        muted: false,
        signedOpened: false,
        transcriptOpened: false,
      },
      "exit-quiz": mapQuiz(progress.exitQuiz),
    },
  };
}
