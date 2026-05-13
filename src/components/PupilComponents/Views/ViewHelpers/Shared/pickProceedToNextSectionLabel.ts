import type { LessonSectionResults } from "@/context/PupilLessonProgress";

export const pickProceedToNextSectionLabel = ({
  lessonStarted,
  isLessonComplete,
  sectionResults,
}: {
  lessonStarted: boolean;
  isLessonComplete: boolean;
  sectionResults: LessonSectionResults;
}) => {
  if (isLessonComplete) return "Lesson review";
  if (lessonStarted) return "Continue lesson";
  if (sectionResults.intro?.isComplete) return "Start lesson";
  return "Let's get ready";
};
