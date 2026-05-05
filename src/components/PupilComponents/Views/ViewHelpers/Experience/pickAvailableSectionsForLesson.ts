import {
  allLessonReviewSections,
  LessonReviewSection,
} from "@/components/PupilComponents/lessonSections";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonShareVariant } from "@/pages-helpers/pupil";

export const pickAvailableSectionsForLesson = (
  lessonContent: LessonContent,
  variant: LessonShareVariant | null,
  isReview: boolean = false,
) => {
  const filterOutVariantExclusions = (section: LessonReviewSection) => {
    if (!variant) return true;
    const validSections = isReview ? variant.reviewSections : variant.sections;
    return validSections.includes(section);
  };
  return allLessonReviewSections
    .filter(filterOutVariantExclusions)
    .filter((section) => {
      switch (section) {
        case "starter-quiz":
          return Boolean(lessonContent?.starterQuiz?.length);
        case "exit-quiz":
          return Boolean(lessonContent?.exitQuiz?.length);
        case "video":
          return Boolean(lessonContent?.videoMuxPlaybackId);
        default:
          return true;
      }
    });
};
