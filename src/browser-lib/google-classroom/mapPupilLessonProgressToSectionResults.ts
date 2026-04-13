import {
  CourseWorkPupilProgress,
  PupilLessonProgress,
} from "@oaknational/google-classroom-addon/types";

import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const mapPupilLessonProgressToSectionResults = (
  lessonProgress: PupilLessonProgress | CourseWorkPupilProgress,
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
