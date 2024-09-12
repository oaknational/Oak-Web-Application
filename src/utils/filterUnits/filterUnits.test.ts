import unitListingFixture from "../../node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

import filterUnits from "./filterUnits";

describe("filterUnits", () => {
  it("should return units if themeSlug is undefined", () => {
    const units = unitListingFixture().units;
    const themeSlug = undefined;
    expect(filterUnits(themeSlug, undefined, units)).toEqual(units);
  });
  it("should return units if themeSlug has a value", () => {
    const themeSlug = "computer-science-1";
    const units = unitListingFixture().units;
    expect(filterUnits(themeSlug, undefined, units)).toEqual([
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
});
