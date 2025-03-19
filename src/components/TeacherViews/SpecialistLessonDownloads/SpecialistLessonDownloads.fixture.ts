import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { SpecialistLessonDownloads } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";

export const downloads: LessonDownloadsPageData["downloads"] = [
  {
    type: "worksheet-pdf",
    exists: true,
    label: "Worksheet",
    ext: "PDF",
  },
  {
    type: "presentation",
    exists: true,
    label: "Presentation",
    ext: "PPT",
  },
  {
    type: "exit-quiz-questions",
    exists: true,
    label: "Exit quiz questions",
    ext: "PDF",
  },
  {
    type: "exit-quiz-answers",
    exists: true,
    label: "Exit quiz answers",
    ext: "PDF",
  },
];

export const nextLessons = [
  {
    lessonSlug: "were-part-of-the-same-pond-2",
    lessonTitle: "We're part of the same pond",
  },
  { lessonSlug: "glitter-gems-3", lessonTitle: "Glitter gems" },
  { lessonSlug: "games-apart-4", lessonTitle: "Games apart" },
];

const specialistLessonDownloadsFixtures = (
  partial?: Partial<SpecialistLessonDownloads>,
): SpecialistLessonDownloads => {
  return {
    lesson: {
      expired: false,
      isLegacy: true,
      isSpecialist: true,
      lessonSlug: "test-lesson-1",
      lessonTitle: "Test lesson",
      programmeSlug: "test-arts-l",
      subjectSlug: "test-subject",
      subjectTitle: "Test subject",
      unitSlug: "test-unit",
      unitTitle: "Test unit",
      nextLessons: nextLessons,
      downloads: downloads,
      additionalFiles: [],
      updatedAt: "2021-09-29T14:00:00Z",
      geoRestricted: false,
      loginRequired: false,
    },
    ...partial,
  };
};

export default specialistLessonDownloadsFixtures;
