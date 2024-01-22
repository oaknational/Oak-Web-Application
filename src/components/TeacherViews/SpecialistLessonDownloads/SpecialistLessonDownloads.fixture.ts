import { SpecialistLessonDownloadsProps } from "./SpecialistLessonDownloads.view";

const specialistLessonDownloadsFixtures = (
  partial?: Partial<SpecialistLessonDownloadsProps>,
): SpecialistLessonDownloadsProps => {
  return {
    lesson: {
      isLegacy: true,
      lessonSlug: "test-lesson-1",
      lessonTitle: "Test lesson",
      programmeSlug: "test-arts-l",
      subjectSlug: "test-subject",
      subjectTitle: "Test subject",
      unitSlug: "test-unit",
      unitTitle: "Test unit",

      nextLessons: [
        {
          lessonSlug: "test-lesson-1",
          lessonTitle: "Test lesson 1",
        },
        { lessonSlug: "test-lesson-2", lessonTitle: "Test lesson 2" },
        { lessonSlug: "test-lesson-3", lessonTitle: "Test lesson 3" },
      ],
      downloads: [
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
      ],
    },
    ...partial,
  };
};

export default specialistLessonDownloadsFixtures;
