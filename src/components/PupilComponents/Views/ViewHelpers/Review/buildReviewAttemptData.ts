import { AttemptDataCamelCase } from "@/node-lib/pupil-api/types";
import { LessonSectionResults } from "@/context/PupilLessonProgress";

export const buildReviewAttemptData = ({
  lessonSlug,
  lessonTitle,
  subject,
  yearDescription,
  sectionResults,
}: {
  lessonSlug: string;
  lessonTitle: string;
  subject: string;
  yearDescription?: string | null;
  sectionResults: LessonSectionResults;
}): AttemptDataCamelCase => ({
  lessonData: { slug: lessonSlug, title: lessonTitle },
  browseData: {
    subject,
    yearDescription: yearDescription ?? "",
  },
  sectionResults,
});
