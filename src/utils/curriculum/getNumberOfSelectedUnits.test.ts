import { getNumberOfSelectedUnits } from "./getNumberOfSelectedUnits";
import { isVisibleUnit, PartialFilters } from "./isVisibleUnit";
import { YearData, Unit, Subject, Tier, SubjectCategory } from "./types";

jest.mock("./isVisibleUnit");

const mockIsVisibleUnit = isVisibleUnit as jest.MockedFunction<
  typeof isVisibleUnit
>;

describe("getNumberOfSelectedUnits", () => {
  let yearData: YearData;

  beforeEach(() => {
    jest.clearAllMocks();

    yearData = {
      "7": {
        units: [{ slug: "unit1" }, { slug: "unit2" }] as Unit[],
        childSubjects: [] as Subject[],
        tiers: [] as Tier[],
        subjectCategories: [] as SubjectCategory[],
        isSwimming: false,
        groupAs: null,
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
        isSwimming: false,
        groupAs: null,
      },
    };
  });

  it("should return 0 when yearData is empty", () => {
    const result = getNumberOfSelectedUnits({}, "", {
      years: [],
      threads: [],
    });
    expect(result).toBe(0);
  });

  it("should count visible units for all years when selectedYear is All", () => {
    const yearSelection: PartialFilters = {
      years: [],
      threads: [],
    };
    mockIsVisibleUnit.mockReturnValue(true);

    const result = getNumberOfSelectedUnits(yearData, "all", yearSelection);
    expect(result).toBe(5);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });

  it("should count visible units only for the selected year", () => {
    const yearSelection: PartialFilters = {
      years: [],
      threads: [],
    };
    mockIsVisibleUnit.mockReturnValue(true);

    const result = getNumberOfSelectedUnits(yearData, "8", yearSelection);
    expect(result).toBe(3);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(3);
  });

  it("should only count units that are visible according to isVisibleUnit", () => {
    const yearSelection: PartialFilters = {
      years: [],
      threads: [],
    };
    mockIsVisibleUnit
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = getNumberOfSelectedUnits(yearData, "all", yearSelection);
    expect(result).toBe(3);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });

  it("should return 0 when no units are visible according to isVisibleUnit", () => {
    const yearSelection: PartialFilters = {
      years: [],
      threads: [],
    };
    mockIsVisibleUnit.mockReturnValue(false);

    const result = getNumberOfSelectedUnits(yearData, "all", yearSelection);
    expect(result).toBe(0);
    expect(mockIsVisibleUnit).toHaveBeenCalledTimes(5);
  });
});
