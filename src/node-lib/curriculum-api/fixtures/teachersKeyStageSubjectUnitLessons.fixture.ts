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
        slug: "macbeth-lesson-1",
        title: "Islamic Geometry",
        description:
          "In this lesson, we will focus on Islamic beliefs about holy books and we will consider why in Islam the Qur'an is a revelation prized above all others. We will explore the importance of holy books (Scrolls of Ibrahim, Tawrat, Zabur, Injil), the difference between those revelations and the revelation of the Qur'an and what the Qur'an is and what the Qur'an contains.",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        unitSlug: "some-unit-slug",
        subjectTitle: "Maths",
        themeSlug: "some-theme-slug",
        themeTitle: "Some theme title",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 2,
        hasCopyrightMaterial: false,
        expired: true,
      },
      {
        slug: "macbeth-lesson-1",
        title:
          "Creating a sculpture inspired by Chakaia Booker and Anish Kapoor",
        description:
          "In this lesson, we will look at artworks in relation to biomorphism. We will look at how Anish Kapoor and Chakaia Booker's sculptures have a biomorphic shape, and then create our own sculpture inspired by nature.",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        unitSlug: "some-unit-slug",
        subjectTitle: "Maths",
        themeSlug: "some-theme-slug",
        themeTitle: "Some theme title",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        expired: false,
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectUnitsLessonsFixture;
