import { LessonReviewSection } from "@/context/PupilLessonProgress";

export const getHasQuizSections = (
  lessonReviewSections: Readonly<LessonReviewSection[]>,
) => {
  return (
    lessonReviewSections.includes("starter-quiz") ||
    lessonReviewSections.includes("exit-quiz")
  );
};
