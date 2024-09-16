import unitListingFixture from "../../node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

import filterUnits from "./filterUnits";

describe("filterUnits", () => {
  it("should return units if themeSlug is undefined", () => {
    const units = unitListingFixture().units;
    const themeSlug = undefined;
    expect(filterUnits(themeSlug, undefined, undefined, units)).toEqual(units);
  });
  it("should return units if themeSlug has a value", () => {
    const themeSlug = "computer-science-1";
    const units = unitListingFixture().units;
    expect(filterUnits(themeSlug, undefined, undefined, units)).toEqual([
      [
        {
          slug: "data-representation-618b",
          title: "Data Representation",
          nullTitle: "Data Representation",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 9,
          unitStudyOrder: 1,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          subjectCategories: null,
          learningThemes: [
            {
              themeSlug: "computer-science-1",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
    ]);
  });
  it("should return units if categorySlug has a value", () => {
    const categorySlug = "grammar";
    const units = unitListingFixture().units;
    expect(filterUnits(undefined, categorySlug, undefined, units)).toEqual([
      [
        {
          slug: "computer-systems-e17a",
          title: "Computer Systems",
          nullTitle: "Computer Systems",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 12,
          unitStudyOrder: 2,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],

          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "networks-fe4b",
          title: "Networks",
          nullTitle: "Networks",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],
          learningThemes: [
            {
              themeSlug: "computer-science-3",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
    ]);
  });
  it("should return unit when both subjectCategory and learningTheme passed into function", () => {
    const categorySlug = "grammar";
    const themeSlug = "computer-science-3";
    const units = unitListingFixture().units;
    expect(filterUnits(themeSlug, categorySlug, undefined, units)).toEqual([
      [
        {
          slug: "networks-fe4b",
          title: "Networks",
          nullTitle: "Networks",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-3",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
    ]);
  });
  it("should return unit when both subjectCategory and learningTheme passed into function", () => {
    const categorySlug = "grammar";
    const themeSlug = "computer-science-3";
    const year = "year-10";
    const units = unitListingFixture().units;
    const filteredUnits = filterUnits(undefined, undefined, year, units);

    filteredUnits.forEach((unit) => {
      unit.forEach((u) => {
        expect(u.year).toBe(year);
        expect(u.yearTitle).toBe("Year 10");
      });
    });

    expect(filterUnits(themeSlug, categorySlug, year, units)).toEqual([
      [
        {
          slug: "networks-fe4b",
          title: "Networks",
          nullTitle: "Networks",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-3",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
    ]);
  });
});
