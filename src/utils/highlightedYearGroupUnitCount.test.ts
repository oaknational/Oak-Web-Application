import highlightedYearGroupUnitCount from "./highlightedYearGroupUnitCount";

import {
  YearData,
  YearSelection,
  Unit,
  Subject,
  Tier,
  SubjectCategory,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

jest.mock("@/components/CurriculumComponents/CurriculumVisualiser", () => ({
  isVisibleUnit: jest.fn(),
}));

describe("highlightedYearGroupUnitCount", () => {
  const mockIsVisibleUnit = jest.requireMock(
    "@/components/CurriculumComponents/CurriculumVisualiser",
  ).isVisibleUnit;

  let yearData: YearData;

  beforeEach(() => {
    jest.clearAllMocks();

    yearData = {
      "7": {
        units: [{ slug: "unit1" }, { slug: "unit2" }] as Unit[],
        childSubjects: [] as Subject[],
        tiers: [] as Tier[],
        subjectCategories: [] as SubjectCategory[],
      },
      "8": {
        units: [
          { slug: "unit3" },
          { slug: "unit4" },
          { slug: "unit5" },
        ] as Unit[],
        childSubjects: [] as Subject[],
        tiers: [] as Tier[],
        subjectCategories: [] as SubjectCategory[],
      },
    };
  });

  it("should return 0 when yearData is empty", () => {
    const result = highlightedYearGroupUnitCount({}, "", {});
    expect(result).toBe(0);
  });

  it("should count visible units for all years when selectedYear is All", () => {
    const yearSelection: YearSelection = {};
    mockIsVisibleUnit.mockReturnValue(true);

    const result = highlightedYearGroupUnitCount(yearData, "", yearSelection);
    expect(result).toBe(5);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });

  it("should count visible units only for the selected year", () => {
    const yearSelection: YearSelection = {};
    mockIsVisibleUnit.mockReturnValue(true);

    const result = highlightedYearGroupUnitCount(yearData, "8", yearSelection);
    expect(result).toBe(3);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(3);
  });

  it("should only count units that are visible according to isVisibleUnit", () => {
    const yearSelection: YearSelection = {};
    mockIsVisibleUnit
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = highlightedYearGroupUnitCount(yearData, "", yearSelection);
    expect(result).toBe(3);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });

  it("should return 0 when no units are visible according to isVisibleUnit", () => {
    const yearSelection: YearSelection = {};
    mockIsVisibleUnit.mockReturnValue(false);

    const result = highlightedYearGroupUnitCount(yearData, "", yearSelection);
    expect(result).toBe(0);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });
});
