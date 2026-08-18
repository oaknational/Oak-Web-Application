import { PersistStorage, StorageValue } from "zustand/middleware";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  FILTER_TO_QS,
  filtersToQuery,
} from "@/context/BrowseFilters/filtering";

export const BROWSE_FILTERS_STORE_NAME = "curriculumFilters";
export const BROWSE_FILTERS_STORE_VERSION = 0;

/**
 * The slice of the store that is mirrored into the URL.
 */
export type BrowseFiltersPersistedState = {
  filters: Partial<CurriculumFilters>;
};

const FILTER_KEYS = Object.keys(FILTER_TO_QS) as (keyof CurriculumFilters)[];
const FILTER_QS_KEYS = Object.values(FILTER_TO_QS);

/**
 * Reads the filters encoded in a query string, ignoring any params that don't
 * belong to us. Only keys actually present in the URL are returned, so the
 * store's `merge` can layer them over the defaults rather than replacing them.
 */
export function filtersFromSearchString(
  search: string,
): Partial<CurriculumFilters> {
  const params = new URLSearchParams(search);
  const filters: Partial<CurriculumFilters> = {};

  for (const key of FILTER_KEYS) {
    const value = params.get(FILTER_TO_QS[key]);
    if (value) {
      filters[key] = value.split(",");
    }
  }

  return filters;
}

/**
 * Writes `filters` into `search`, leaving every non-filter param untouched.
 * Values matching the default filter are omitted so shared URLs stay short.
 */
export function searchStringWithFilters(
  search: string,
  filters: CurriculumFilters,
  defaultFilter: CurriculumFilters,
): string {
  const params = new URLSearchParams(search);
  const query = filtersToQuery(filters, defaultFilter);

  for (const qsKey of FILTER_QS_KEYS) {
    params.delete(qsKey);
  }
  for (const [qsKey, value] of Object.entries(query)) {
    params.set(qsKey, value);
  }

  return params.toString();
}

const replaceSearch = (search: string) => {
  const url = search
    ? `${window.location.pathname}?${search}`
    : window.location.pathname;

  globalThis.history.replaceState(null, "", url);
};

/**
 * A zustand `PersistStorage` backed by the URL query string.
 *
 * Unlike the JSON-blob approach in the zustand docs, this keeps the existing
 * flat, human-readable param scheme (`?years=7,8&child_subjects=biology`) that
 * `resolveFilterFromSearchParams` already reads server-side for SSR, so shared
 * and bookmarked links keep working.
 *
 * There is deliberately no `localStorage` tier: the default filter is derived
 * per-programme from its unit data, so restoring a previous programme's
 * selection would produce filters that don't exist in the current dataset.
 */
export function createCurriculumFiltersUrlStorage(
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
