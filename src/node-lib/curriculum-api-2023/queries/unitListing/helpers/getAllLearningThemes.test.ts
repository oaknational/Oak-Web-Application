import { getAllLearningThemes } from "./getAllLearningThemes";

describe("unit listing threads", () => {
  test("getAllLearningThemes returns themes in alphabetical order", () => {
    const res = getAllLearningThemes([
      [
        {
          slug: "unit-slug",
          title: "unit-title",
          nullTitle: "unit-title",
          programmeSlug: "programme-slug",
          keyStageSlug: "ks2",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          keyStageTitle: "Key Stage 2",
          yearTitle: "Year 4",
          yearOrder: 1,
          year: "year-4",
          unitStudyOrder: 1,
          cohort: "cohort",
          lessonCount: 1,
          expired: false,
          expiredLessonCount: 1,
          unpublishedLessonCount: 0,
          learningThemes: [
            { themeSlug: "b theme", themeTitle: "B Theme" },
            { themeSlug: "a theme", themeTitle: "A Theme" },
            { themeSlug: "c theme", themeTitle: "C Theme" },
          ],
        },
      ],
    ]);

    expect(res).toEqual([
      { themeSlug: "a theme", themeTitle: "A Theme" },
      { themeSlug: "b theme", themeTitle: "B Theme" },
      { themeSlug: "c theme", themeTitle: "C Theme" },
    ]);
  });
});
