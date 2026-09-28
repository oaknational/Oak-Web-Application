import { PersistStorage, StorageValue } from "zustand/middleware";

import { BrowseFilters } from "./types";
import { addFiltersToSearchString, getFiltersFromSearchString } from "./utils";

export const BROWSE_FILTERS_STORE_NAME = "BrowseFilters";
export const BROWSE_FILTERS_STORE_VERSION = 0;

export type BrowseFiltersPersistedState = {
  filters: Partial<BrowseFilters>;
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

  const filters = getFiltersFromSearchString(window.location.search);
  if (Object.keys(filters).length === 0) {
    return null;
  }

  return {
    state: { filters },
    version: BROWSE_FILTERS_STORE_VERSION,
  };
}

function writeFiltersToUrl(
  filters: BrowseFilters,
  defaultFilter: BrowseFilters,
) {
  if (typeof window === "undefined") {
    return;
  }

  replaceSearch(
    addFiltersToSearchString(window.location.search, filters, defaultFilter),
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
  getDefaultFilter: () => BrowseFilters,
): PersistStorage<BrowseFiltersPersistedState> {
  return {
    getItem: readFiltersFromUrl,
    setItem: (_name, value) =>
      writeFiltersToUrl(
        value.state.filters as BrowseFilters,
        getDefaultFilter(),
      ),
    // No-op: use `setFilters(defaultFilter)` for an actual "reset filters" action.
    removeItem: () => {},
  };
}
