import { LessonDownloadsData } from "..";

const lessonDownloadsFixtures = (
  partial?: Partial<LessonDownloadsData>,
): LessonDownloadsData => {
  return {
    isLegacy: true,
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4-l",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    tierSlug: null,
    tierTitle: null,
    examBoardSlug: null,
    examBoardTitle: null,
    hasDownloadableResources: true,
    nextLessons: [
      { lessonSlug: "macbeth-lesson-2", lessonTitle: "Macbeth" },
      { lessonSlug: "macbeth-lesson-3", lessonTitle: "Macbeth" },
      { lessonSlug: "macbeth-lesson-4", lessonTitle: "Macbeth" },
    ],
    downloads: [
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
    ...partial,
  };
};

export default lessonDownloadsFixtures;
