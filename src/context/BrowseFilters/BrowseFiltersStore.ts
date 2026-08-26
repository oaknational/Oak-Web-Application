import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { isEqual } from "lodash";
import type { ReadonlyURLSearchParams } from "next/navigation";

import {
  BrowseFiltersPersistedState,
  BROWSE_FILTERS_STORE_NAME,
  BROWSE_FILTERS_STORE_VERSION,
  createBrowseFiltersUrlStorage,
} from "./browseFiltersUrlStorage";
import { BrowseFilters } from "./types";
import { applySearchParamsToFilter } from "./utils/applySearchParamsToFilter";
import { scopeYearsToKeystageFilter } from "./utils/scopeYearsToKeystageFilter";

export type BrowseFiltersStore = {
  filters: BrowseFilters;
  /**
   * The data-derived baseline for this programme
   */
  defaultFilter: BrowseFilters;
  yearsForKeystage: string[];
  setFilters: (newFilters: BrowseFilters) => void;
  /**
   * Applies the URL to the store
   */
  syncFromSearchParams: (
    params: ReadonlyURLSearchParams | URLSearchParams | null,
  ) => void;
};

export type CreateBrowseFiltersStoreOptions = {
  defaultFilter: BrowseFilters;
  initialFilter?: BrowseFilters;
};

export const createBrowseFiltersStore = ({
  defaultFilter,
  initialFilter,
}: CreateBrowseFiltersStoreOptions) => {
  // The storage needs the *current* default filter, which lives in the store
  // it is being built for, so it reads back through this reference.
  const storeRef: { current?: StoreApi<BrowseFiltersStore> } = {};

  const storage = createBrowseFiltersUrlStorage(
    () => storeRef.current?.getState().defaultFilter ?? defaultFilter,
  );

  const store = createStore<BrowseFiltersStore>()(
    persist<BrowseFiltersStore, [], [], BrowseFiltersPersistedState>(
      (set) => ({
        filters: initialFilter ?? defaultFilter,
        defaultFilter,
        yearsForKeystage: scopeYearsToKeystageFilter(
          initialFilter ?? defaultFilter,
        ),
        setFilters: (newFilters) =>
          set({
            filters: newFilters,
            yearsForKeystage: scopeYearsToKeystageFilter(newFilters),
          }),
        syncFromSearchParams: (params) =>
          set((state) => {
            const nextFilters = applySearchParamsToFilter(
              state.defaultFilter,
              params,
            );

            // If nothing changed, don't trigger a re-render
            return isEqual(nextFilters, state.filters)
              ? state
              : {
                  filters: nextFilters,
                  yearsForKeystage: scopeYearsToKeystageFilter(nextFilters),
                };
          }),
      }),
      {
        // This is for persisting in local storage and migrating between versions, we don't need it yet but it's a mandatory field.
        name: BROWSE_FILTERS_STORE_NAME,
        version: BROWSE_FILTERS_STORE_VERSION,
        storage,
        skipHydration: true,
        partialize: (state) => ({ filters: state.filters }),
        merge: (persisted, current) => {
          const persistedFilters = (
            persisted as BrowseFiltersPersistedState | undefined
          )?.filters;

          if (!persistedFilters) {
            return current;
          }

          // Layer over `defaultFilter` (not `current.filters`) so this matches
          // `syncFromSearchParams`: the URL is the source of truth.
          const mergedFilters = {
            ...current.defaultFilter,
            ...persistedFilters,
          };

          return {
            ...current,
            filters: mergedFilters,
            yearsForKeystage: scopeYearsToKeystageFilter(mergedFilters),
          };
        },
      },
    ),
  );

  storeRef.current = store;

  return store;
};

export type BrowseFiltersStoreApi = ReturnType<typeof createBrowseFiltersStore>;
