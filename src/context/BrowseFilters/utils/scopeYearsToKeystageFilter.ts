import { BrowseFilters } from "../types";

import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { KeyStageSlug } from "@/utils/curriculum/types";

/**
 * When a keystage filter is active and years is at its default (all years),
 * returns only the years belonging to the active keystage(s). Mirrors the
 * applyFiltering logic in by-pathway.ts so filter visibility matches the unit list.
 */
export function scopeYearsToKeystageFilter(filters: BrowseFilters): string[] {
  const selectingAllYears = filters.years.length > 1;
  if (!selectingAllYears || filters.keystages.length === 0) {
    return filters.years;
  }

  return filters.years.filter((year) =>
    filters.keystages.some((ks) =>
      keystageYearMappings[ks as KeyStageSlug]?.includes(year),
    ),
  );
}
