import { getYearGroupTitle } from "./formatting";

describe("getYearGroupTitle", () => {
  it("support all-years", () => {
    expect(
      getYearGroupTitle(
        {
          ["all-years"]: {
            units: [],
            childSubjects: [],
            tiers: [],
            subjectCategories: [],
            labels: [],
            groupAs: "Swimming",
          },
        },
        "all-years",
      ),
    ).toEqual("Swimming (all years)");
  });

  it("support years", () => {
    expect(
      getYearGroupTitle(
        {
          ["7"]: {
            units: [],
            childSubjects: [],
            tiers: [],
            subjectCategories: [],
            labels: [],
            groupAs: null,
          },
        },
        "7",
      ),
    ).toEqual("Year 7");
  });
});
