import { BrowseFilters } from "../types";

import { applySearchParamsToFilter } from "./applySearchParamsToFilter";

export type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Resolves the filter from raw search params (server-side).
 * Converts PageSearchParams into a BrowseFilters with URL params applied.
 * Used in page.tsx to pre-resolve filters before SSR.
 */
export function resolveBrowseFilterFromSearchParams(
  defaultFilter: BrowseFilters,
  searchParams: RawSearchParams | undefined,
): BrowseFilters {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v == null) continue;
      if (Array.isArray(v)) {
        v.forEach((item) => {
          params.append(k, item);
        });
      } else {
        params.append(k, v);
      }
    }
  }

  return applySearchParamsToFilter(defaultFilter, params);
}
