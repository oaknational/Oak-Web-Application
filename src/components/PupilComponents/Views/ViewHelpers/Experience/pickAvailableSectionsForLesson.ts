import { allLessonReviewSections } from "@/components/PupilComponents/lessonSections";
import { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const pickAvailableSectionsForLesson = (lessonContent: LessonContent) =>
  allLessonReviewSections.filter((section) => {
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
