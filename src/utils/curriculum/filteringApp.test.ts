import { getDefaultFilter } from "./filteringApp";

import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createFilter } from "@/fixtures/curriculum/filters";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";

describe("filteringApp - getDefaultFilter", () => {
  const mockData: CurriculumUnitsFormattedData = formatCurriculumUnitsData(
    curriculumUnitsTabFixture(),
  );

  it("with data - should use data-based defaults when no initialFilters", () => {
    const out = getDefaultFilter(mockData);
    expect(out).toEqual({
      childSubjects: ["combined-science"],
      subjectCategories: ["all"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8", "9", "10", "11"],
      pathways: [],
      keystages: [],
    });
  });

  it("with empty initialFilters should fall back to data-based defaults", () => {
    const emptyInitialFilters = createFilter();
    const out = getDefaultFilter(mockData, emptyInitialFilters);
    expect(out).toEqual({
      childSubjects: ["combined-science"],
      subjectCategories: ["all"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8", "9", "10", "11"],
      pathways: [],
      keystages: [],
    });
  });

  it("with initialFilters should use provided filter values", () => {
    const initialFilters = createFilter({
      childSubjects: ["custom-subject"],
      tiers: ["custom-tier"],
    });
    const out = getDefaultFilter(mockData, initialFilters);
    expect(out).toEqual({
      childSubjects: ["custom-subject"],
      subjectCategories: ["all"],
      threads: [],
      tiers: ["custom-tier"],
      years: ["7", "8", "9", "10", "11"],
      pathways: [],
      keystages: [],
    });
  });

  it("with initialFilters containing empty arrays should fall back to defaults for those filters", () => {
    const initialFilters = createFilter({
      childSubjects: ["custom-subject"],
      subjectCategories: [],
      years: [],
    });
    const out = getDefaultFilter(mockData, initialFilters);
    expect(out).toEqual({
      childSubjects: ["custom-subject"],
      subjectCategories: ["all"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8", "9", "10", "11"],
      pathways: [],
      keystages: [],
    });
  });

  it("with initialFilters for all filter types should use provided values", () => {
    const initialFilters = createFilter({
      childSubjects: ["child-1", "child-2"],
      subjectCategories: ["cat-1"],
      tiers: ["tier-1"],
      years: ["9", "10"],
      threads: ["thread-1"],
      pathways: ["pathway-1"],
      keystages: ["ks4"],
    });
    const out = getDefaultFilter(mockData, initialFilters);
    expect(out).toEqual({
      childSubjects: ["child-1", "child-2"],
      subjectCategories: ["cat-1"],
      tiers: ["tier-1"],
      years: ["9", "10"],
      threads: ["thread-1"],
      pathways: ["pathway-1"],
      keystages: ["ks4"],
    });
  });

  it("should use empty arrays from initialFilters as valid values, not fallback to defaults", () => {
    const initialFilters = createFilter({
      threads: [],
      pathways: [],
    });
    const out = getDefaultFilter(mockData, initialFilters);
    // Empty arrays in initialFilters should not trigger fallback
    expect(out.threads).toEqual([]);
    expect(out.pathways).toEqual([]);
  });
});
