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
        description: "Lorem ipsum",
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
      {
        slug: "trig",
        title: "Trigonometry",
        description: "Lorem ipsum",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        themeSlug: "some-theme-slug",
        themeTitle: "Some theme title",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 0,
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectUnitsLessonsFixture;
