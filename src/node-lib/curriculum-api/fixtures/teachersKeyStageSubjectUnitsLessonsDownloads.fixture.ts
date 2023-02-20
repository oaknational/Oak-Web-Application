import { TeachersKeyStageSubjectUnitsLessonsDownloadsData } from "..";

const teachersKeyStageSubjectUnitsLessonsDownloadsFixtures = (
  partial?: Partial<TeachersKeyStageSubjectUnitsLessonsDownloadsData>
): TeachersKeyStageSubjectUnitsLessonsDownloadsData => {
  return {
    slug: "macbeth-lesson-1",
    title: "Islamic Geometry",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    themeSlug: "numbers",
    themeTitle: "Numbers",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    downloads: [
      {
        type: "exit-quiz-questions",
        exists: true,
        label: "Exit quiz",
        ext: "PDF",
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectUnitsLessonsDownloadsFixtures;
