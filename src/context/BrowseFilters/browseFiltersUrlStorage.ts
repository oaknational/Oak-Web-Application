import { PersistStorage, StorageValue } from "zustand/middleware";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  FILTER_QS_KEYS,
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

export function createBrowseFiltersUrlStorage(
  getDefaultFilter: () => CurriculumFilters,
): PersistStorage<BrowseFiltersPersistedState> {
  return {
    getItem: (): StorageValue<BrowseFiltersPersistedState> | null => {
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
    },
    setItem: (_name, value) => {
      if (typeof window === "undefined") {
        return;
      }

      replaceSearch(
        searchStringWithFilters(
          window.location.search,
          value.state.filters as CurriculumFilters,
          getDefaultFilter(),
        ),
      );
    },
    removeItem: () => {
      if (typeof window === "undefined") {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      for (const qsKey of FILTER_QS_KEYS) {
        params.delete(qsKey);
      }

      replaceSearch(params.toString());
    },
  };
}
