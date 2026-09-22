import { createFilter } from "./fixtures";
import { getApplicableBrowseFilters } from "./getApplicableBrowseFilters";

describe("getApplicableBrowseFilters", () => {
  it("with default", () => {
    const result = getApplicableBrowseFilters(createFilter(), {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    });
    expect(result).toEqual({});
  });

  it("with data", () => {
    const childSubject1 = "geography";
    const childSubject2 = "maths";
    const subCat1 = 1;
    const subCat2 = 2;
    const tier1 = "foundation";
    const tier2 = "higher";
    const thread1 = "thread_1";
    const thread2 = "thread_2";

    const result = getApplicableBrowseFilters(
      createFilter({
        childSubjects: [childSubject1, childSubject2],
        subjectCategories: [String(subCat1), String(subCat2)],
        tiers: [tier1, tier2],
        years: ["7", "8"],
        threads: [thread1, thread2],
      }),
      {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: [],
        threads: [],
        pathways: [],
        keystages: [],
      },
    );

    expect(result).toEqual({
      child_subjects: "geography,maths",
      subject_categories: "1,2",
      threads: "thread_1,thread_2",
      tiers: "foundation,higher",
      years: "7,8",
    });
  });
});
