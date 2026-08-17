import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";

import { CurriculumFiltersProvider } from "./CurriculumFiltersProvider";
import { useProgrammeFilters } from "./useProgrammeFilters";

import { createFilter } from "@/fixtures/curriculum/filters";
import MockedTeacherBrowseAnalyticsProvider from "@/__tests__/__helpers__/MockedTeacherBrowseAnalyticsProvider";

const mockProgrammeRefined = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      programmeRefined: (...args: []) => mockProgrammeRefined(...args),
    },
  }),
}));

const mockSearchParams = new URLSearchParams("");

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => mockSearchParams,
}));

const defaultFilter = createFilter({
  years: ["7", "8"],
  tiers: ["foundation"],
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedTeacherBrowseAnalyticsProvider>
    <CurriculumFiltersProvider defaultFilter={defaultFilter}>
      {children}
    </CurriculumFiltersProvider>
  </MockedTeacherBrowseAnalyticsProvider>
);

describe("useProgrammeFilters", () => {
  beforeEach(() => {
    mockProgrammeRefined.mockClear();
    globalThis.history.replaceState(null, "", "/programme/units");
  });

  it("updates the filters", () => {
    const { result } = renderHook(() => useProgrammeFilters(), { wrapper });

    act(() => {
      result.current.onChangeFilters({
        newFilters: createFilter({ years: ["7"], tiers: ["higher"] }),
        filterType: "Tier filter",
        filterValue: "higher",
      });
    });

    expect(result.current.filters.tiers).toEqual(["higher"]);
  });

  it("fires programmeRefined with the filters that were just applied", () => {
    const { result } = renderHook(() => useProgrammeFilters(), { wrapper });
    const newFilters = createFilter({ years: ["7"], tiers: ["higher"] });

    act(() => {
      result.current.onChangeFilters({
        newFilters,
        filterType: "Tier filter",
        filterValue: "higher",
      });
    });

    expect(mockProgrammeRefined).toHaveBeenCalledTimes(1);
    expect(mockProgrammeRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "filter_link",
        filterType: "Tier filter",
        filterValue: "higher",
        activeFilters: newFilters,
      }),
    );
  });

  it("skips tracking when the change carries no filterType", () => {
    const { result } = renderHook(() => useProgrammeFilters(), { wrapper });

    act(() => {
      result.current.onChangeFilters({
        newFilters: createFilter({ years: ["7"], tiers: ["higher"] }),
      });
    });

    expect(result.current.filters.tiers).toEqual(["higher"]);
    expect(mockProgrammeRefined).not.toHaveBeenCalled();
  });

  it("keeps a stable onChangeFilters across renders", () => {
    const { result, rerender } = renderHook(() => useProgrammeFilters(), {
      wrapper,
    });
    const first = result.current.onChangeFilters;

    rerender();

    expect(result.current.onChangeFilters).toBe(first);
  });
});
