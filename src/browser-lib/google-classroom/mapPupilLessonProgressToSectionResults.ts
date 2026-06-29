import { PupilLessonProgress } from "@oaknational/google-classroom-addon/types";

import { LessonSectionResults } from "@/context/PupilLessonProgress";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Maps a Google Classroom add-on pupil lesson progress payload back into the
 * shape consumed by the pupil lesson progress store, so a pupil resuming a
 * Classroom assignment sees their prior answers restored.
 */
export const mapPupilLessonProgressToSectionResults = (
  lessonProgress: PupilLessonProgress,
): LessonSectionResults => {
  if (!isRecord(lessonProgress)) {
    return {};
  }

  return {
    ...(isRecord(lessonProgress.starterQuiz) && {
      "starter-quiz":
        lessonProgress.starterQuiz as LessonSectionResults["starter-quiz"],
    }),
    ...(isRecord(lessonProgress.exitQuiz) && {
      "exit-quiz": lessonProgress.exitQuiz as LessonSectionResults["exit-quiz"],
    }),
    ...(isRecord(lessonProgress.video) && {
      video: lessonProgress.video as LessonSectionResults["video"],
    }),
    ...(isRecord(lessonProgress.intro) && {
      intro: lessonProgress.intro as LessonSectionResults["intro"],
    }),
  };
};
