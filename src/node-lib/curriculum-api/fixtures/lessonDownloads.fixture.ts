import { LessonDownloadsData } from "..";

const lessonDownloadsFixtures = (
  partial?: Partial<LessonDownloadsData>,
): LessonDownloadsData => {
  return {
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    tierSlug: null,
    tierTitle: null,
    examboardSlug: null,
    examboardTitle: null,
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
