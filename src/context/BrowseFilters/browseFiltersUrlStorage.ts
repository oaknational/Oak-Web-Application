import { PersistStorage, StorageValue } from "zustand/middleware";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  filtersFromSearchString,
  searchStringWithFilters,
} from "@/utils/curriculum/filtering";

export const BROWSE_FILTERS_STORE_NAME = "curriculumFilters";
export const BROWSE_FILTERS_STORE_VERSION = 0;

export type BrowseFiltersPersistedState = {
  filters: Partial<CurriculumFilters>;
};

const replaceSearch = (search: string) => {
  const basePath = search
    ? `${window.location.pathname}?${search}`
    : window.location.pathname;

  globalThis.history.replaceState(null, "", basePath + window.location.hash);
};

function readFiltersFromUrl(): StorageValue<BrowseFiltersPersistedState> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const filters = filtersFromSearchString(window.location.search);
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return {
    state: { filters },
    version: BROWSE_FILTERS_STORE_VERSION,
  };
}

function writeFiltersToUrl(
  filters: CurriculumFilters,
  defaultFilter: CurriculumFilters,
) {
  if (typeof window === "undefined") {
    return;
  }

  replaceSearch(
    searchStringWithFilters(window.location.search, filters, defaultFilter),
  );
}

/**
 * `persist`'s `PersistStorage` interface is a generic keyed store (like
 * `localStorage`), but this adapter only ever backs one slot - the browse
 * filters - so `name` is unused throughout. `getItem`/`setItem` are just the
 * interface's required names; the real behaviour lives in
 * `readFiltersFromUrl`/`writeFiltersToUrl` above.
 */
export function createBrowseFiltersUrlStorage(
  getDefaultFilter: () => CurriculumFilters,
): PersistStorage<BrowseFiltersPersistedState> {
  return {
    getItem: readFiltersFromUrl,
    setItem: (_name, value) =>
      writeFiltersToUrl(
        value.state.filters as CurriculumFilters,
        getDefaultFilter(),
      ),
    // No-op: use `setFilters(defaultFilter)` for an actual "reset filters" action.
    removeItem: () => {},
  };
}
