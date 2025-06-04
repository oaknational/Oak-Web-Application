import { YearGroups } from "../../../node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

import getYearGroupSEOString from "./get-year-grp-seo-string";

describe("getYearGroupSEOString", () => {
  describe("empty or single year groups", () => {
    it("returns empty string for empty array", () => {
      const yearGroups: YearGroups = [];
      expect(getYearGroupSEOString(yearGroups)).toBe("");
    });

    it("returns 'Reception' for single Reception year", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Reception", year: "reception" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Reception");
    });

    it("returns 'All years' for single All years", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "All years", year: "all-years" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("All years");
    });

    it("returns formatted single year for regular year", () => {
      const yearGroups: YearGroups = [{ yearTitle: "Year 6", year: "year-6" }];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y6");
    });

    it("handles single year with different format", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Year 10", year: "year-10" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y10");
    });
  });

  describe("multiple year groups", () => {
    it("formats two consecutive years correctly", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Year 6", year: "year-6" },
        { yearTitle: "Year 7", year: "year-7" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y6 & 7");
    });

    it("formats three years correctly", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Year 6", year: "year-6" },
        { yearTitle: "Year 7", year: "year-7" },
        { yearTitle: "Year 8", year: "year-8" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y6, 7 & 8");
    });

    it("formats four years correctly", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Year 6", year: "year-6" },
        { yearTitle: "Year 7", year: "year-7" },
        { yearTitle: "Year 8", year: "year-8" },
        { yearTitle: "Year 9", year: "year-9" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y6, 7, 8 & 9");
    });

    it("handles years with double digits", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Year 10", year: "year-10" },
        { yearTitle: "Year 11", year: "year-11" },
        { yearTitle: "Year 12", year: "year-12" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Y10, 11 & 12");
    });
  });

  describe("Reception in multiple year groups", () => {
    it("handles Reception as first item with other years", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Reception", year: "reception" },
        { yearTitle: "Year 1", year: "year-1" },
        { yearTitle: "Year 2", year: "year-2" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Reception, Y1 & 2");
    });

    it("handles mixed Reception and regular years", () => {
      const yearGroups: YearGroups = [
        { yearTitle: "Reception", year: "reception" },
        { yearTitle: "Year 1", year: "year-1" },
      ];
      expect(getYearGroupSEOString(yearGroups)).toBe("Reception & Y1");
    });
  });
});
