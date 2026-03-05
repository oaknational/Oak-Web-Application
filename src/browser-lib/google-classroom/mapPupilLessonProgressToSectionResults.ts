import { PupilLessonProgress } from "@oaknational/google-classroom-addon/types";

import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

export const mapPupilLessonProgressToSectionResults = (
  lessonProgress: PupilLessonProgress,
): LessonSectionResults => {
  if (!lessonProgress || typeof lessonProgress !== "object") {
    return {};
  }
  const progress = lessonProgress as Record<string, unknown>;
  const results: LessonSectionResults = {};

  if (progress.starterQuiz && typeof progress.starterQuiz === "object") {
    results["starter-quiz"] =
      progress.starterQuiz as LessonSectionResults["starter-quiz"];
  }
  if (progress.exitQuiz && typeof progress.exitQuiz === "object") {
    results["exit-quiz"] =
      progress.exitQuiz as LessonSectionResults["exit-quiz"];
  }
  if (progress.video && typeof progress.video === "object") {
    results.video = progress.video as LessonSectionResults["video"];
  }
  if (progress.intro && typeof progress.intro === "object") {
    results.intro = progress.intro as LessonSectionResults["intro"];
  }

  return results;
};
