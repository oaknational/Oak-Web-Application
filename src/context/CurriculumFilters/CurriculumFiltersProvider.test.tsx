import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";

import {
  CurriculumFiltersProvider,
  useCurriculumFilters,
} from "./CurriculumFiltersProvider";

import { createFilter } from "@/fixtures/curriculum/filters";
import { CurriculumFilters } from "@/utils/curriculum/types";

let mockSearchParams = new URLSearchParams("");

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => mockSearchParams,
}));

const defaultFilter = createFilter({
  years: ["7", "8"],
  tiers: ["foundation"],
});

const setUrl = (search: string) => {
  globalThis.history.replaceState(
    null,
    "",
    search ? `/programme/units?${search}` : "/programme/units",
  );
  mockSearchParams = new URLSearchParams(search);
};

const renderFilters = (initialFilter?: CurriculumFilters) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CurriculumFiltersProvider
      defaultFilter={defaultFilter}
      initialFilter={initialFilter}
    >
      {children}
    </CurriculumFiltersProvider>
  );

  return renderHook(() => useCurriculumFilters(), { wrapper });
};

describe("CurriculumFiltersProvider", () => {
  beforeEach(() => {
    setUrl("");
  });

  it("provides the default filter when the URL is bare", () => {
    const { result } = renderFilters();

    expect(result.current[0]).toEqual(defaultFilter);
  });

  it("applies the filters present in the URL on mount", () => {
    setUrl("tiers=higher");

    const { result } = renderFilters();

    expect(result.current[0].tiers).toEqual(["higher"]);
    expect(result.current[0].years).toEqual(["7", "8"]);
  });

  it("keeps the server-resolved filter when the URL agrees with it", () => {
    setUrl("tiers=higher");

    const { result } = renderFilters(
      createFilter({ years: ["7", "8"], tiers: ["higher"] }),
    );

    expect(result.current[0].tiers).toEqual(["higher"]);
  });

  it("writes filter changes to the URL in place", () => {
    const { result } = renderFilters();

    act(() => {
      result.current[1](createFilter({ years: ["7"], tiers: ["higher"] }));
    });

    expect(result.current[0].tiers).toEqual(["higher"]);
    expect(window.location.pathname).toBe("/programme/units");
    expect(new URLSearchParams(window.location.search).get("tiers")).toBe(
      "higher",
    );
  });

  it("re-syncs when the search params change, as on browser back", () => {
    setUrl("tiers=higher");
    const { result, rerender } = renderFilters();

    expect(result.current[0].tiers).toEqual(["higher"]);

    act(() => {
      setUrl("");
    });
    rerender();

    expect(result.current[0].tiers).toEqual(["foundation"]);
  });

  it("throws a useful error when used outside the provider", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => renderHook(() => useCurriculumFilters())).toThrow(
      "useCurriculumFiltersStore must be used within CurriculumFiltersProvider",
    );

    consoleError.mockRestore();
  });
});
