"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";

import { CurriculumFilters } from "./types";
import { mergeInFilterParams, filtersToQuery } from "./filtersUrl";

// Re-export all pure functions for backwards compatibility
export {
  getDefaultFilter,
  getDefaultChildSubjectForYearGroup,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  filtersToQuery,
  mergeInFilterParams,
  getFilterData,
  isHighlightedUnit,
  filteringFromYears,
  highlightedUnitCount,
  shouldDisplayFilter,
  diffFilters,
  getNumberOfFiltersApplied,
  subjectCategoryForFilter,
  childSubjectForFilter,
  tierForFilter,
  threadForFilter,
  buildTextDescribingFilter,
  keystageSuffixForFilter,
  getNumberOfSelectedUnits,
  FILTER_TO_QS,
} from "./filtersUrl";

export function useFilters(
  defaultFilter: CurriculumFilters,
  initialFilter?: CurriculumFilters,
): [CurriculumFilters, (newFilters: CurriculumFilters) => void] {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CurriculumFilters>(
    initialFilter ?? defaultFilter,
  );
  useLayoutEffect(() => {
    setFilters(mergeInFilterParams(defaultFilter, searchParams));
  }, [searchParams, defaultFilter]);

  const setExternalFilters = useCallback(
    (newFilters: CurriculumFilters) => {
      const url =
        location.pathname +
        "?" +
        new URLSearchParams(
          Object.entries(filtersToQuery(newFilters, defaultFilter)),
        ).toString();

      globalThis.history.replaceState(null, "", url);

      setFilters(newFilters);
    },
    [defaultFilter],
  );

  return [filters, setExternalFilters];
}
