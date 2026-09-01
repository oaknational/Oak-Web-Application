"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  const [store] = useState(() =>
    createBrowseFiltersStore({ defaultFilter, initialFilter }),
  );
  const searchParams = useSearchParams();

  // Hydration is skipped on store creation
  // apply the initial URL after mount.
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);

  // The provider can survive a client-side Link navigation, so re-apply the
  // current URL whenever Next updates the search params.
  useEffect(() => {
    store.getState().syncFromSearchParams(searchParams);
  }, [searchParams, store]);

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
