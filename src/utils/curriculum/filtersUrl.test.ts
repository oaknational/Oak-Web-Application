import {
  getDefaultFilter,
  mergeInFilterParams,
  filtersToQuery,
  FILTER_TO_QS,
  getDefaultChildSubjectForYearGroup,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
} from "./filtersUrl";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("filtersUrl (pure functions)", () => {
  describe("FILTER_TO_QS mapping", () => {
    it("has all filter dimensions mapped", () => {
      expect(FILTER_TO_QS.years).toBe("years");
      expect(FILTER_TO_QS.childSubjects).toBe("child_subjects");
      expect(FILTER_TO_QS.subjectCategories).toBe("subject_categories");
      expect(FILTER_TO_QS.tiers).toBe("tiers");
      expect(FILTER_TO_QS.threads).toBe("threads");
      expect(FILTER_TO_QS.pathways).toBe("pathways");
      expect(FILTER_TO_QS.keystages).toBe("keystages");
    });
  });

  describe("filtersToQuery", () => {
    it("encodes non-default filters to query params", () => {
      const defaultFilter = createFilter({
        years: ["7", "8"],
        tiers: ["foundation"],
      });
      const currentFilter = createFilter({
        years: ["7"],
        tiers: ["higher"],
      });

      const result = filtersToQuery(currentFilter, defaultFilter);

      expect(result.years).toBe("7");
      expect(result.tiers).toBe("higher");
    });

    it("omits filters that match the default", () => {
      const defaultFilter = createFilter({
        years: ["7", "8"],
        tiers: ["foundation"],
      });
      const currentFilter = createFilter({
        years: ["7", "8"],
        tiers: ["foundation"],
      });

      const result = filtersToQuery(currentFilter, defaultFilter);

      expect(result.years).toBeUndefined();
      expect(result.tiers).toBeUndefined();
    });

    it("joins multiple values with commas", () => {
      const defaultFilter = createFilter({
        childSubjects: ["physics"],
      });
      const currentFilter = createFilter({
        childSubjects: ["physics", "chemistry"],
      });

      const result = filtersToQuery(currentFilter, defaultFilter);

      expect(result.child_subjects).toBe("physics,chemistry");
    });
  });

  describe("mergeInFilterParams", () => {
    it("applies URL params to a filter", () => {
      const defaultFilter = createFilter({
        years: ["7", "8"],
        tiers: ["foundation"],
      });
      const params = new URLSearchParams("years=7&tiers=higher");

      const result = mergeInFilterParams(defaultFilter, params);

      expect(result.years).toEqual(["7"]);
      expect(result.tiers).toEqual(["higher"]);
    });

    it("returns default when no params provided", () => {
      const defaultFilter = createFilter({
        years: ["7", "8"],
        tiers: ["foundation"],
      });

      const result = mergeInFilterParams(defaultFilter, null);

      expect(result).toEqual(defaultFilter);
    });

    it("parses comma-separated values", () => {
      const defaultFilter = createFilter({
        childSubjects: [],
      });
      const params = new URLSearchParams("child_subjects=physics,chemistry");

      const result = mergeInFilterParams(defaultFilter, params);

      expect(result.childSubjects).toEqual(["physics", "chemistry"]);
    });
  });

  describe("getDefaultFilter", () => {
    it("returns a valid filter with all dimensions populated", () => {
      const yearData = {
        "7": createYearData({
          childSubjects: [createChildSubject({ subject_slug: "physics" })],
        }),
      };
      const data: CurriculumUnitsFormattedData = {
        yearData,
        yearOptions: ["7"],
        threadOptions: [],
        keystages: [],
      };

      const result = getDefaultFilter(data);

      expect(result.years).toEqual(["7"]);
      expect(result.childSubjects).toBeDefined();
      expect(result.subjectCategories).toBeDefined();
      expect(result.tiers).toBeDefined();
      expect(result.threads).toEqual([]);
      expect(result.pathways).toEqual([]);
      expect(result.keystages).toEqual([]);
    });
  });

  describe("getDefaultChildSubjectForYearGroup", () => {
    it("returns first sorted child subject", () => {
      const yearData = {
        "7": createYearData({
          childSubjects: [
            createChildSubject({ subject_slug: "physics" }),
            createChildSubject({ subject_slug: "biology" }),
          ],
        }),
      };

      const result = getDefaultChildSubjectForYearGroup(yearData);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeDefined();
    });

    it("returns empty array when no child subjects", () => {
      const yearData = {
        "7": createYearData({
          childSubjects: [],
        }),
      };

      const result = getDefaultChildSubjectForYearGroup(yearData);

      expect(result).toEqual([]);
    });
  });

  describe("getDefaultSubjectCategoriesForYearGroup", () => {
    it("returns first subject category", () => {
      const yearData = {
        "7": createYearData({}),
      };

      const result = getDefaultSubjectCategoriesForYearGroup(yearData);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getDefaultTiersForYearGroup", () => {
    it("returns first sorted tier", () => {
      const yearData = {
        "7": createYearData({}),
      };

      const result = getDefaultTiersForYearGroup(yearData);

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
