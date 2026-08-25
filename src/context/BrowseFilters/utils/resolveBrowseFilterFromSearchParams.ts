import { BrowseFilters } from "../types";

import { applySearchParamsToFilter } from "./applySearchParamsToFilter";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getDefaultFilter } from "@/utils/curriculum/filtering";

type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Resolves the filter from raw search params (server-side)
 * Converts PageSearchParms into a CurriculumFilters with URL params applied
 * Used in page.tsx to pre-resolve filters before SSR
 */
export function resolveBrowseFilterFromSearchParams(
  data: CurriculumUnitsFormattedData,
  searchParams: RawSearchParams | undefined,
): BrowseFilters {
  const defaultFilter = getDefaultFilter(data);
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
