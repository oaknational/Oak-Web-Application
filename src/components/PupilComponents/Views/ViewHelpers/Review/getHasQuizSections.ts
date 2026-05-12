import { LessonReviewSection } from "@/components/PupilComponents/LessonEngineProvider";

export const getHasQuizSections = (
  lessonReviewSections: Readonly<LessonReviewSection[]>,
) => {
  return (
    lessonReviewSections.includes("starter-quiz") ||
    lessonReviewSections.includes("exit-quiz")
  );
};
