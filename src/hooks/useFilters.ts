"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  mergeInFilterParams,
  filtersToQuery,
} from "@/utils/curriculum/filtersUrl";

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
