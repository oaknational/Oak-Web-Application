import { SpecialistLessonDownloadsProps } from "./SpecialistLessonDownloads.view";

const specialistLessonDownloadsFixtures = (
  partial?: Partial<SpecialistLessonDownloadsProps>,
): SpecialistLessonDownloadsProps => {
  return {
    lesson: {
      isLegacy: true,
      lessonSlug: "super-juice-1",
      lessonTitle: "Super juice",
      programmeSlug: "test-arts-l",
      subjectSlug: "specialist-and-therapies",
      subjectTitle: "Specialist and therapies",
      unitSlug: "Creative arts",
      unitTitle: "Creative arts",
      tierSlug: null,
      tierTitle: null,
      examBoardSlug: null,
      examBoardTitle: null,
      nextLessons: [
        {
          lessonSlug: "lockdown-heroes-8",
          lessonTitle: "Lockdown heroes",
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
