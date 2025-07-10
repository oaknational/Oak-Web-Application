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
    expect(result.current.newFilterQuery).toBeNull();
  });
  it("updates newFilterQuery on handleUpdateActiveFilters", () => {
    const { result } = renderHook(() =>
      useUnitFilterState({ isUnitListing: true }),
    );

    act(() => {
      result.current.handleUpdateActiveFilters({
        year: "2023",
        category: "maths",
        theme: "algebra",
      });
    });

    expect(result.current.newFilterQuery).toEqual({
      year: "2023",
      category: "maths",
      theme: "algebra",
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
