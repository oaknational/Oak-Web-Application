import { BrowseFilters } from "../types";

import { applySearchParamsToFilter } from "./applySearchParamsToFilter";
import { getDefaultBrowseFilter } from "./getDefaultBrowseFilter";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Resolves the filter from raw search params (server-side)
 * Converts PageSearchParms into a CurriculumFilters with URL params applied
 * Used in page.tsx to pre-resolve filters before SSR
 */
export function resolveBrowseFilterFromSearchParams(
  data: CurriculumUnitsFormattedData,
  searchParams: RawSearchParams | undefined,
): BrowseFilters {
  const defaultFilter = getDefaultBrowseFilter(data);
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
