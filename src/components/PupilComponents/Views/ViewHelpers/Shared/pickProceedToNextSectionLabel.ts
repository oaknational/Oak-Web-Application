import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const pickProceedToNextSectionLabel = ({
  lessonStarted,
  isLessonComplete,
  sectionResults,
}: {
  lessonStarted: boolean;
  isLessonComplete: boolean;
  sectionResults: ReturnType<typeof useLessonEngineContext>["sectionResults"];
}) => {
  if (isLessonComplete) return "Lesson review";
  if (lessonStarted) return "Continue lesson";
  if (sectionResults.intro?.isComplete) return "Start lesson";
  return "Let's get ready";
};
