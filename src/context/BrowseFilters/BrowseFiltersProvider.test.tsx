import { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";

import {
  BrowseFiltersProvider,
  useBrowseFiltersStore,
} from "./BrowseFiltersProvider";

import { createFilter } from "@/fixtures/curriculum/filters";
import { CurriculumFilters } from "@/utils/curriculum/types";

const useFilters = () => {
  const filters = useBrowseFiltersStore((store) => store.filters);
  const setFilters = useBrowseFiltersStore((store) => store.setFilters);

  return { filters, setFilters };
};

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
    <BrowseFiltersProvider
      defaultFilter={defaultFilter}
      initialFilter={initialFilter}
    >
      {children}
    </BrowseFiltersProvider>
  );

  return renderHook(() => useFilters(), { wrapper });
};

describe("BrowseFiltersProvider", () => {
  beforeEach(() => {
    setUrl("");
  });

  it("provides the default filter when the URL is bare", () => {
    const { result } = renderFilters();

    expect(result.current.filters).toEqual(defaultFilter);
  });

  it("applies the filters present in the URL on mount", () => {
    setUrl("tiers=higher");

    const { result } = renderFilters();

    expect(result.current.filters.tiers).toEqual(["higher"]);
    expect(result.current.filters.years).toEqual(["7", "8"]);
  });

  it("keeps the server-resolved filter when the URL agrees with it", () => {
    setUrl("tiers=higher");

    const { result } = renderFilters(
      createFilter({ years: ["7", "8"], tiers: ["higher"] }),
    );

    expect(result.current.filters.tiers).toEqual(["higher"]);
  });

  it("writes filter changes to the URL in place", () => {
    const { result } = renderFilters();

    act(() => {
      result.current.setFilters(
        createFilter({ years: ["7"], tiers: ["higher"] }),
      );
    });

    expect(result.current.filters.tiers).toEqual(["higher"]);
    expect(window.location.pathname).toBe("/programme/units");
    expect(new URLSearchParams(window.location.search).get("tiers")).toBe(
      "higher",
    );
  });

  it("throws a useful error when used outside the provider", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => renderHook(() => useFilters())).toThrow(
      "useBrowseFiltersStore must be used within BrowseFiltersProvider",
    );

    consoleError.mockRestore();
  });
});
