import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";

import { BrowseFiltersProvider } from "../BrowseFiltersProvider";
import { createFilter } from "../utils/fixtures";

import { useBrowseFilters } from "./useBrowseFilters";

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
    <BrowseFiltersProvider defaultFilter={defaultFilter}>
      {children}
    </BrowseFiltersProvider>
  </MockedTeacherBrowseAnalyticsProvider>
);

describe("useBrowseFilters", () => {
  beforeEach(() => {
    mockProgrammeRefined.mockClear();
    globalThis.history.replaceState(null, "", "/programme/units");
  });

  it("updates the filters", () => {
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });

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
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });
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
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });

    act(() => {
      result.current.onChangeFilters({
        newFilters: createFilter({ years: ["7"], tiers: ["higher"] }),
      });
    });

    expect(result.current.filters.tiers).toEqual(["higher"]);
    expect(mockProgrammeRefined).not.toHaveBeenCalled();
  });

  it("keeps a stable onChangeFilters across renders", () => {
    const { result, rerender } = renderHook(() => useBrowseFilters(), {
      wrapper,
    });
    const first = result.current.onChangeFilters;

    rerender();

    expect(result.current.onChangeFilters).toBe(first);
  });

  it("setYearFilter('all') sets all years and clears pathways", () => {
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });

    act(() => {
      result.current.setYearFilter("all", ["7", "8", "9"]);
    });

    expect(result.current.filters.years).toEqual(["7", "8", "9"]);
    expect(result.current.filters.pathways).toEqual([]);
    expect(mockProgrammeRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Year filter",
        filterValue: "all",
      }),
    );
  });

  it("setThreadFilter sets a single thread", () => {
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });

    act(() => {
      result.current.setThreadFilter("thread1");
    });

    expect(result.current.filters.threads).toEqual(["thread1"]);
    expect(mockProgrammeRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Learning theme filter",
        filterValue: "thread1",
      }),
    );
  });

  it("setThreadFilter('') clears the thread", () => {
    const { result } = renderHook(() => useBrowseFilters(), { wrapper });

    act(() => {
      result.current.setThreadFilter("thread1");
    });
    act(() => {
      result.current.setThreadFilter("");
    });

    expect(result.current.filters.threads).toEqual([]);
  });
});
