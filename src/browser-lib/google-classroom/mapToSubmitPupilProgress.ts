import {
  upsertPupilLessonProgressArgsSchema,
  type UpsertPupilLessonProgressArgs,
} from "@oaknational/google-classroom-addon/types";

import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

export type ClassroomContext = {
  submissionId: string;
  pupilLoginHint: string;
  attachmentId: string;
  courseId: string;
  itemId: string;
};

export function mapToSubmitPupilProgress(
  context: ClassroomContext,
  sectionResults: LessonSectionResults,
): UpsertPupilLessonProgressArgs {
  const payload = {
    submissionId: context.submissionId,
    attachmentId: context.attachmentId,
    courseId: context.courseId,
    itemId: context.itemId,
    pupilLoginHint: context.pupilLoginHint,
    ...(sectionResults["starter-quiz"] && {
      starterQuiz: {
        grade: sectionResults["starter-quiz"].grade,
        numQuestions: sectionResults["starter-quiz"].numQuestions,
        isComplete: sectionResults["starter-quiz"].isComplete,
        questionResults: sectionResults["starter-quiz"].questionResults?.map(
          (qr) => ({
            mode: qr.mode,
            grade: qr.grade,
            pupilAnswer: qr.pupilAnswer ?? null,
            feedback: qr.feedback,
            isPartiallyCorrect: qr.isPartiallyCorrect,
          }),
        ),
      },
    }),
    ...(sectionResults["exit-quiz"] && {
      exitQuiz: {
        grade: sectionResults["exit-quiz"].grade,
        numQuestions: sectionResults["exit-quiz"].numQuestions,
        isComplete: sectionResults["exit-quiz"].isComplete,
        questionResults: sectionResults["exit-quiz"].questionResults?.map(
          (qr) => ({
            mode: qr.mode,
            grade: qr.grade,
            pupilAnswer: qr.pupilAnswer ?? null,
            feedback: qr.feedback,
            isPartiallyCorrect: qr.isPartiallyCorrect,
          }),
        ),
      },
    }),
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

  return upsertPupilLessonProgressArgsSchema.parse(payload);
}
