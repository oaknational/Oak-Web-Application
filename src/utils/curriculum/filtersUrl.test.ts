import {
  getDefaultFilter,
  mergeInFilterParams,
  resolveFilterFromSearchParams,
} from "./filtersUrl";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createYearData } from "@/fixtures/curriculum/yearData";

describe("filtersUrl (server-safe imports)", () => {
  it("exports are importable without React context", () => {
    expect(typeof getDefaultFilter).toBe("function");
    expect(typeof mergeInFilterParams).toBe("function");
  });
});

describe("resolveFilterFromSearchParams", () => {
  const mockData: CurriculumUnitsFormattedData = {
    yearData: {
      "7": createYearData({}),
    },
    yearOptions: ["7"],
    threadOptions: [],
  } as unknown as CurriculumUnitsFormattedData;

  it("returns default filter when no params provided", () => {
    const result = resolveFilterFromSearchParams(mockData, undefined);
    expect(result).toEqual(getDefaultFilter(mockData));
  });

  it("applies string params", () => {
    const result = resolveFilterFromSearchParams(mockData, {
      years: "7",
    });
    expect(result.years).toEqual(["7"]);
  });

  it("applies array params", () => {
    const result = resolveFilterFromSearchParams(mockData, {
      tiers: ["foundation", "higher"],
    });
    expect(result.tiers.length).toBeGreaterThan(0);
  });

  it("ignores undefined values", () => {
    const result = resolveFilterFromSearchParams(mockData, {
      years: undefined,
    });
    expect(result).toEqual(getDefaultFilter(mockData));
  });
});
