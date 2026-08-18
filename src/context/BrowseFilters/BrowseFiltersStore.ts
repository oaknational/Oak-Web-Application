import { createStore, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { isEqual } from "lodash";
import type { ReadonlyURLSearchParams } from "next/navigation";

import {
  createCurriculumFiltersUrlStorage,
  BrowseFiltersPersistedState,
  BROWSE_FILTERS_STORE_NAME,
  BROWSE_FILTERS_STORE_VERSION,
} from "./browseFiltersUrlStorage";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { mergeInFilterParams } from "@/utils/curriculum/filtering";

export type BrowseFiltersStore = {
  filters: CurriculumFilters;
  /**
   * The data-derived baseline for this programme. Values equal to it are
   * omitted from the URL, and params absent from the URL fall back to it.
   */
  defaultFilter: CurriculumFilters;
  /**
   * Replaces the active filters. Prefer `useProgrammeFilters` over calling this
   * directly — it pairs the state change with the `programmeRefined` event.
   */
  setFilters: (newFilters: CurriculumFilters) => void;
  /**
   * Applies the URL to the store: params that are present win, params that are
   * absent reset to `defaultFilter`. This is the URL -> store direction, and is
   * what makes browser back/forward restore the right filters.
   */
  syncFromSearchParams: (
    params: ReadonlyURLSearchParams | URLSearchParams | null,
  ) => void;
};

export type CreateBrowseFiltersStoreOptions = {
  defaultFilter: CurriculumFilters;
  /**
   * Filters already resolved from the URL on the server, used to seed the store
   * so the first client render matches the SSR output.
   */
  initialFilter?: CurriculumFilters;
};

/**
 * A per-programme filters store, scoped by `BrowseFiltersProvider` rather
 * than being a module-level singleton, because `defaultFilter` is derived from
 * the programme's own unit data. A singleton would leak one programme's
 * selection into the next on client-side navigation.
 *
 * The store owns the store -> URL direction via the `persist` middleware.
 * The URL -> store direction is driven by the provider calling
 * `syncFromSearchParams`; `persist`'s own rehydration is skipped because it can
 * only layer params over existing state, and cannot reset a filter whose param
 * has been removed (e.g. by navigating back).
 */
export const createBrowseFiltersStore = ({
  defaultFilter,
  initialFilter,
}: CreateBrowseFiltersStoreOptions) => {
  // The storage needs the *current* default filter, which lives in the store
  // it is being built for, so it reads back through this reference.
  const storeRef: { current?: StoreApi<BrowseFiltersStore> } = {};

  const storage = createCurriculumFiltersUrlStorage(
    () => storeRef.current?.getState().defaultFilter ?? defaultFilter,
  );

  const store = createStore<BrowseFiltersStore>()(
    persist<BrowseFiltersStore, [], [], BrowseFiltersPersistedState>(
      (set) => ({
        filters: initialFilter ?? defaultFilter,
        defaultFilter,
        setFilters: (newFilters) => set({ filters: newFilters }),
        syncFromSearchParams: (params) =>
          set((state) => {
            const nextFilters = mergeInFilterParams(
              state.defaultFilter,
              params,
            );

            // Bail out when nothing changed so subscribers aren't woken by a
            // new-but-equal object on every navigation.
            return isEqual(nextFilters, state.filters)
              ? state
              : { filters: nextFilters };
          }),
      }),
      {
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
          return {
            ...current,
            filters: { ...current.defaultFilter, ...persistedFilters },
          };
        },
      },
    ),
  );

  storeRef.current = store;

  return store;
};

export type BrowseFiltersStoreApi = ReturnType<typeof createBrowseFiltersStore>;
