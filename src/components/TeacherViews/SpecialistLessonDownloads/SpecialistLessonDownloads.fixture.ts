import { SpecialistLessonDownloadsProps } from "./SpecialistLessonDownloads.view";

import { LessonDownloadsData } from "@/node-lib/curriculum-api";

export const downloads: LessonDownloadsData["downloads"] = [
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
  partial?: Partial<SpecialistLessonDownloadsProps>,
): SpecialistLessonDownloadsProps => {
  return {
    lesson: {
      expired: false,
      isLegacy: true,
      lessonSlug: "test-lesson-1",
      lessonTitle: "Test lesson",
      programmeSlug: "test-arts-l",
      subjectSlug: "test-subject",
      subjectTitle: "Test subject",
      unitSlug: "test-unit",
      unitTitle: "Test unit",
      nextLessons: nextLessons,
      downloads: downloads,
      hasDownloadableResources: true,
    },
    ...partial,
  };
};

export default specialistLessonDownloadsFixtures;
