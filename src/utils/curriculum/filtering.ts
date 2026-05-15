import { useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";

import { CurriculumFilters } from "./types";
import { mergeInFilterParams, filtersToQuery } from "./filtersUrl";

// Re-export all pure functions from filtersUrl (single source of truth)
export {
  getDefaultChildSubjectForYearGroup,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  getDefaultFilter,
  FILTER_TO_QS,
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
} from "./filtersUrl";

export function useFilters(
  defaultFilter: CurriculumFilters,
): [CurriculumFilters, (newFilters: CurriculumFilters) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<CurriculumFilters>(defaultFilter);
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

      router.replace(url, undefined, {
        shallow: true,
        scroll: false,
      });

      setFilters(newFilters);
    },
    [defaultFilter, router],
  );

  return [filters, setExternalFilters];
}
