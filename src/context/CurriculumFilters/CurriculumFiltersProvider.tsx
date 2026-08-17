"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { useStore } from "zustand";
import { useSearchParams } from "next/navigation";

import {
  createCurriculumFiltersStore,
  CurriculumFiltersStore,
  CurriculumFiltersStoreApi,
} from "./CurriculumFiltersStore";

import { CurriculumFilters } from "@/utils/curriculum/types";

export const CurriculumFiltersStoreContext = createContext<
  CurriculumFiltersStoreApi | undefined
>(undefined);

export type CurriculumFiltersProviderProps = {
  defaultFilter: CurriculumFilters;
  initialFilter?: CurriculumFilters;
  children: ReactNode;
};

export const CurriculumFiltersProvider = ({
  defaultFilter,
  initialFilter,
  children,
}: CurriculumFiltersProviderProps) => {
  const searchParams = useSearchParams();
  const [store] = useState(() =>
    createCurriculumFiltersStore({ defaultFilter, initialFilter }),
  );

  // Declared before the sync effect so `syncFromSearchParams` always merges
  // against the current programme's defaults.
  useLayoutEffect(() => {
    if (store.getState().defaultFilter !== defaultFilter) {
      store.setState({ defaultFilter });
    }
  }, [store, defaultFilter]);

  // Applies the URL on mount, and again whenever Next reports new search
  // params. Our own writes go through `history.replaceState`, which Next does
  // not observe, so in practice this only re-fires for browser back/forward.
  useLayoutEffect(() => {
    store.getState().syncFromSearchParams(searchParams);
  }, [store, searchParams]);

  return (
    <CurriculumFiltersStoreContext.Provider value={store}>
      {children}
    </CurriculumFiltersStoreContext.Provider>
  );
};

export const useCurriculumFiltersStore = <T,>(
  selector: (store: CurriculumFiltersStore) => T,
): T => {
  const curriculumFiltersStoreContext = useContext(
    CurriculumFiltersStoreContext,
  );

  if (!curriculumFiltersStoreContext) {
    throw new Error(
      `useCurriculumFiltersStore must be used within CurriculumFiltersProvider`,
    );
  }

  return useStore(curriculumFiltersStoreContext, selector);
};

/**
 * Drop-in replacement for the `useFilters` hook, for call sites that only need
 * the state and don't fire analytics. Anything on the programme page that
 * changes filters in response to a user action should use `useProgrammeFilters`
 * instead, so the `programmeRefined` event isn't lost.
 */
export const useCurriculumFilters = (): [
  CurriculumFilters,
  (newFilters: CurriculumFilters) => void,
] => {
  const filters = useCurriculumFiltersStore((store) => store.filters);
  const setFilters = useCurriculumFiltersStore((store) => store.setFilters);

  return [filters, setFilters];
};
