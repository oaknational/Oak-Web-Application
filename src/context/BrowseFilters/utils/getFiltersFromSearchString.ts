import {
  browseFilterKeys,
  browseFilterQueryParamMap,
  BrowseFilters,
  filterValueSchemas,
} from "../types";

/**
 * Reads the filters encoded in a query string, ignoring any params that don't
 * belong to us. Only keys actually present in the URL are returned, so callers
 * can layer them over defaults rather than replacing them outright.
 */
export function getFiltersFromSearchString(
  search: string,
): Partial<BrowseFilters> {
  const params = new URLSearchParams(search);
  const filters: Partial<BrowseFilters> = {};

  for (const key of browseFilterKeys) {
    const value = params.get(browseFilterQueryParamMap[key]);
    if (value) {
      const result = filterValueSchemas
        .partial()
        .safeParse({ [key]: value.split(",") });

      if (result.success) {
        Object.assign(filters, result.data);
      }
    }
  }

  return filters;
}
