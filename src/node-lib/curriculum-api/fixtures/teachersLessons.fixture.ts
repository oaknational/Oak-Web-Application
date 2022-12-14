import { TeachersKeyStageSubjectUnitsLessonsData } from "..";

const teachersKeyStageSubjectUnitsLessonsFixture = (
  partial?: Partial<TeachersKeyStageSubjectUnitsLessonsData>
): TeachersKeyStageSubjectUnitsLessonsData => {
  return {
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: null,
    unitSlug: "some-unit-slug",
    unitTitle: "Some unit",
    lessons: [
      {
        slug: "geometry",
        title: "Geometry",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        themeSlug: "some-theme-slug",
        themeTitle: "Some theme title",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 2,
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectUnitsLessonsFixture;
