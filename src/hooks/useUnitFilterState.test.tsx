import { act, renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";

import { useUnitFilterState } from "./useUnitFilterState";

const mockBrowseRefined = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => mockBrowseRefined(...args),
    },
  }),
}));

describe("useUnitFilterState", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockRouter.push({
      pathname: "/teachers/programmes/art-primary-ks1/units",
      query: {},
    });
  });
  it("initializes with correct state", async () => {
    mockRouter.push({
      pathname: "/teachers/programmes/art-primary-ks1/units",
      query: {
        "learning-theme": "computer-science-2",
      },
    });
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    expect(result.current.appliedThemeSlug).toBe("computer-science-2");
    expect(result.current.appliedCategorySlug).toBeUndefined();
    expect(result.current.appliedyearGroupSlug).toBeUndefined();
    expect(result.current.isMobileFilterDrawerOpen).toBe(false);
  });
  it("updates newFilterQuery on handleUpdateActiveFilters", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    act(() => {
      result.current.handleUpdateActiveFilters({
        year: "year-5",
        category: "maths",
        theme: "algebra",
      });
    });

    expect(result.current.incomingCategorySlug).toEqual("maths");
    expect(result.current.incomingThemeSlug).toEqual("algebra");
    expect(result.current.incomingYearSlug).toEqual("year-5");
  });
  it("clears newFilterQuery on handleUpdateActiveFilters with null", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );
    act(() => {
      result.current.handleUpdateActiveFilters(null);
    });
    expect(result.current.incomingCategorySlug).toBe("");
    expect(result.current.incomingThemeSlug).toBe("all");
    expect(result.current.incomingYearSlug).toBe("");
  });
  it("handles missing filter params ", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    act(() => {
      result.current.handleUpdateActiveFilters({
        year: "year-5",
      });
    });

    expect(result.current.incomingCategorySlug).toBe("");
    expect(result.current.incomingThemeSlug).toBe("all");
    expect(result.current.incomingYearSlug).toBe("year-5");
  });
  it("handles null filter params", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );
    act(() => {
      result.current.handleUpdateActiveFilters({
        year: null,
        category: null,
        theme: null,
      });
    });
    expect(result.current.incomingCategorySlug).toBe("");
    expect(result.current.incomingThemeSlug).toBe("all");
    expect(result.current.incomingYearSlug).toBe("");
  });
  it("updates and submits", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    act(() => {
      result.current.handleUpdateAndSubmitFilterQuery({
        year: "year-7",
        category: "maths",
        theme: "algebra",
      });
    });

    expect(mockRouter.query).toEqual({
      year: "year-7",
      category: "maths",
      "learning-theme": "algebra",
    });
  });
  it("calls browse refined on update", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    act(() => {
      result.current.handleSubmitFilterQuery({
        year: "2023",
        category: "maths",
        theme: "algebra",
      });
    });

    expect(mockBrowseRefined).toHaveBeenCalledWith({
      activeFilters: {
        category: "maths",
        content_types: "units",
        learning_themes: "algebra",
        year_group: "2023",
      },
      analyticsUseCase: "Teacher",
      componentType: "filter_link",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      filterType: "Learning theme filter",
      filterValue: "algebra",
      platform: "owa",
      product: "teacher lesson resources",
    });
  });
  it("does not call browse refined on update if isUnitListing is false", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: false }),
    );

    act(() => {
      result.current.handleSubmitFilterQuery({
        year: "2023",
        category: "maths",
        theme: "algebra",
      });
    });

    expect(mockBrowseRefined).not.toHaveBeenCalled();
  });
});
