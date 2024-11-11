import filterUnits from "./filterUnits";

import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import { ReshapedUnitData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

describe("filterUnits", () => {
  it("should return all units if all filters are undefined", () => {
    const params = {
      themeSlug: undefined,
      categorySlug: undefined,
      yearGroup: undefined,
      units: unitListingFixture().units,
    };
    const units = unitListingFixture().units;

    expect(filterUnits<ReshapedUnitData>(params)).toEqual(units);
  });
  it("should return units with same theme if themeSlug has a value", () => {
    const params = {
      themeSlug: "computer-science-1",
      categorySlug: undefined,
      yearGroup: undefined,
      units: unitListingFixture().units,
    };

    expect(filterUnits(params)).toEqual([
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
  it("should return units with matching categorySlug", () => {
    const params = {
      themeSlug: undefined,
      categorySlug: "grammar",
      yearGroup: undefined,
      units: unitListingFixture().units,
    };

    expect(filterUnits(params)).toEqual([
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
  it("should return units with both matching subjectCategory and learningTheme", () => {
    const params = {
      themeSlug: "computer-science-3",
      categorySlug: "grammar",
      yearGroup: undefined,
      units: unitListingFixture().units,
    };

    expect(filterUnits(params)).toEqual([
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
  it("should return units with correct year", () => {
    const params = {
      themeSlug: undefined,
      categorySlug: undefined,
      yearGroup: "year-10",
      units: unitListingFixture().units,
    };

    const filteredUnits = filterUnits(params);

    filteredUnits.forEach((unit) => {
      unit.forEach((u) => {
        expect(u.year).toBe(params.yearGroup);
        expect(u.yearTitle).toBe("Year 10");
      });
    });
  });
  it("returns correct units when all filters are applied", () => {
    const categorySlug = "grammar";
    const themeSlug = "computer-science-3";
    const yearGroup = "year-10";
    const units = unitListingFixture().units;
    expect(filterUnits({ themeSlug, categorySlug, yearGroup, units })).toEqual([
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
