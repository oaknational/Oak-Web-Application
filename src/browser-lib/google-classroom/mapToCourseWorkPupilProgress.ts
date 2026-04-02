import type { UpsertCourseWorkPupilProgressArgs } from "@oaknational/google-classroom-addon/types";

import type { CourseWorkProgressContext } from "./classroomAssignmentContext";

import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

type QuizSectionResult = NonNullable<
  LessonSectionResults["starter-quiz"] | LessonSectionResults["exit-quiz"]
>;

const mapQuizProgress = (quizResult: QuizSectionResult | undefined) => {
  if (!quizResult) return undefined;
  return {
    grade: quizResult.grade ?? 0,
    numQuestions: quizResult.numQuestions ?? 0,
    isComplete: quizResult.isComplete ?? false,
  };
};

export function mapToCourseWorkPupilProgress(
  context: CourseWorkProgressContext,
  sectionResults: LessonSectionResults,
): UpsertCourseWorkPupilProgressArgs {
  return {
    submissionId: context.submissionId,
    assignmentToken: context.assignmentToken,
    courseWorkId: context.courseWorkId,
    courseId: context.courseId,
    pupilLoginHint: context.pupilLoginHint,
    starterQuiz: mapQuizProgress(sectionResults["starter-quiz"]),
    exitQuiz: mapQuizProgress(sectionResults["exit-quiz"]),
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
}
