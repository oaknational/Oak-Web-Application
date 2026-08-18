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
  createBrowseFiltersStore,
  BrowseFiltersStore,
  BrowseFiltersStoreApi,
} from "./BrowseFiltersStore";

import { CurriculumFilters } from "@/utils/curriculum/types";

export const BrowseFiltersStoreContext = createContext<
  BrowseFiltersStoreApi | undefined
>(undefined);

export type BrowseFiltersProviderProps = {
  defaultFilter: CurriculumFilters;
  initialFilter?: CurriculumFilters;
  children: ReactNode;
};

export const BrowseFiltersProvider = ({
  defaultFilter,
  initialFilter,
  children,
}: BrowseFiltersProviderProps) => {
  const searchParams = useSearchParams();
  const [store] = useState(() =>
    createBrowseFiltersStore({ defaultFilter, initialFilter }),
  );

  useLayoutEffect(() => {
    if (store.getState().defaultFilter !== defaultFilter) {
      store.setState({ defaultFilter });
    }
  }, [store, defaultFilter]);

  // Keeps the store in sync with back/forward navigation.
  useLayoutEffect(() => {
    store.getState().syncFromSearchParams(searchParams);
  }, [store, searchParams]);

  return (
    <BrowseFiltersStoreContext.Provider value={store}>
      {children}
    </BrowseFiltersStoreContext.Provider>
  );
};

export const useBrowseFiltersStore = <T,>(
  selector: (store: BrowseFiltersStore) => T,
): T => {
  const curriculumFiltersStoreContext = useContext(BrowseFiltersStoreContext);

  if (!curriculumFiltersStoreContext) {
    throw new Error(
      `useBrowseFiltersStore must be used within BrowseFiltersProvider`,
    );
  }

  return useStore(curriculumFiltersStoreContext, selector);
};
