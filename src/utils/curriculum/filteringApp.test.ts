import { useSearchParams } from "next/navigation";
import { act, renderHook } from "@testing-library/react";

import { useFilters } from "./filteringApp";

import { createFilter } from "@/fixtures/curriculum/filters";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockHistoryReplaceState = jest.fn();
Object.defineProperty(globalThis, "history", {
  value: {
    replaceState: mockHistoryReplaceState,
  },
  writable: true,
});

describe("filteringApp", () => {
  describe("useFilters with initialFilter", () => {
    beforeEach(() => {
      mockHistoryReplaceState.mockClear();
    });

    it("uses initialFilter as initial state when provided", () => {
      const defaultFilter = createFilter({ years: ["7", "8", "9"] });
      const initialFilter = createFilter({ years: ["7"] });

      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("years=7"),
      );

      const { result } = renderHook(() =>
        useFilters(defaultFilter, initialFilter),
      );

      const [filters] = result.current;
      expect(filters.years).toEqual(["7"]);
    });

    it("still applies URL params when initialFilter is provided and differs", () => {
      const defaultFilter = createFilter({ tiers: ["foundation"] });
      const initialFilter = createFilter({ tiers: ["foundation"] });

      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("tiers=higher"),
      );

      const { result } = renderHook(() =>
        useFilters(defaultFilter, initialFilter),
      );

      const [filters] = result.current;
      expect(filters.tiers).toEqual(["higher"]);
    });

    it("updates filters when setFilters is called with initialFilter present", () => {
      const defaultFilter = createFilter({ years: ["7", "8"] });
      const initialFilter = createFilter({ years: ["7"] });

      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("years=7"),
      );

      const { result, rerender } = renderHook(() =>
        useFilters(defaultFilter, initialFilter),
      );

      const newFilter = createFilter({ years: ["8"] });
      const [, setFilters] = result.current;

      act(() => {
        setFilters(newFilter);
      });

      rerender();
      const [filters] = result.current;
      expect(filters.years).toEqual(["8"]);
      expect(mockHistoryReplaceState).toHaveBeenCalled();
    });

    it("falls back to defaultFilter when initialFilter is not provided", () => {
      const defaultFilter = createFilter({ tiers: ["foundation"] });

      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));

      const { result } = renderHook(() => useFilters(defaultFilter));

      const [filters] = result.current;
      expect(filters.tiers).toEqual(defaultFilter.tiers);
    });

    it("respects initialFilter with multiple filter dimensions", () => {
      const defaultFilter = createFilter({
        years: ["7", "8", "9"],
        tiers: ["foundation"],
        childSubjects: [],
      });
      const initialFilter = createFilter({
        years: ["7"],
        tiers: ["higher"],
        childSubjects: ["combined-science"],
      });

      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams(
          "years=7&tiers=higher&child_subjects=combined-science",
        ),
      );

      const { result } = renderHook(() =>
        useFilters(defaultFilter, initialFilter),
      );

      const [filters] = result.current;
      expect(filters.years).toEqual(["7"]);
      expect(filters.tiers).toEqual(["higher"]);
      expect(filters.childSubjects).toEqual(["combined-science"]);
    });
  });
});
