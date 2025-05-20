import { createFilter } from "./index";

describe("createFilter", () => {
  it("default filter", () => {
    const result = createFilter();
    expect(result).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
    });
  });

  it("assign childSubjects to filter", () => {
    const result = createFilter({
      childSubjects: ["test1", "test2"],
    });
    expect(result).toEqual({
      childSubjects: ["test1", "test2"],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
    });
  });

  it("assign subjectCategories to filter", () => {
    const result = createFilter({
      subjectCategories: ["test1", "test2"],
    });
    expect(result).toEqual({
      childSubjects: [],
      subjectCategories: ["test1", "test2"],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
    });
  });

  it("assign tiers to filter", () => {
    const result = createFilter({
      tiers: ["foundation", "higher"],
    });
    expect(result).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: ["foundation", "higher"],
      years: [],
      threads: [],
      pathways: [],
    });
  });

  it("assign years to filter", () => {
    const result = createFilter({
      years: ["9", "10", "11"],
    });
    expect(result).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: ["9", "10", "11"],
      threads: [],
      pathways: [],
    });
  });

  it("assign threads to filter", () => {
    const result = createFilter({
      threads: ["test1", "test2"],
    });
    expect(result).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: ["test1", "test2"],
      pathways: [],
    });
  });
});
