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
        description:
          "In this lesson, we will focus on Islamic beliefs about holy books and we will consider why in Islam the Qur'an is a revelation prized above all others. We will explore the importance of holy books (Scrolls of Ibrahim, Tawrat, Zabur, Injil), the difference between those revelations and the revelation of the Qur'an and what the Qur'an is and what the Qur'an contains.",
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
