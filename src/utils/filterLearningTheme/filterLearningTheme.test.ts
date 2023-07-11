import unitListingFixture from "../../node-lib/curriculum-api/fixtures/unitListing.fixture";

import { filterLearningTheme } from "./filterLearningTheme";

describe("filterLearningTheme", () => {
  it("should return units if themeSlug is undefined", () => {
    const units = unitListingFixture().units;
    const themeSlug = undefined;
    expect(filterLearningTheme(themeSlug, units)).toEqual(units);
  });
  it("should return units if themeSlug has a value", () => {
    const themeSlug = "computer-science-1";
    const units = unitListingFixture().units;
    expect(filterLearningTheme(themeSlug, units)).toEqual([
      [
        {
          slug: "data-representation-618b",
          title: "Data Representation",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-1",
          themeTitle: "Computer Science",
          lessonCount: 9,
          quizCount: null,
          unitStudyOrder: 1,
          expired: false,
          expiredLessonCount: 0,
        },
      ],
    ]);
  });
});
