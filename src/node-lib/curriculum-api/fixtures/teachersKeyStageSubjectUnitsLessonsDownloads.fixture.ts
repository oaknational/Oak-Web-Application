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
    presentationUrl:
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp;delayms=3000",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp;delayms=3000",
    hasCopyrightMaterial: false,
    downloads: [
      {
        type: "exit_quiz",
        source:
          "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp;delayms=3000",
      },
    ],
    ...partial,
  };
};

export default teachersKeyStageSubjectUnitsLessonsDownloadsFixtures;
