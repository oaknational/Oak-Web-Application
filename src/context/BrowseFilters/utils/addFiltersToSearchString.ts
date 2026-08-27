import {
  browseFilterKeys,
  browseFilterQueryParamMap,
  BrowseFilters,
} from "../types";

import { getApplicableBrowseFilters } from "./getApplicableBrowseFilters";

/**
 * Writes `filters` into `search`, leaving every non-filter param untouched.
 * Values matching the default filter are omitted so shared URLs stay short.
 */
export function addFiltersToSearchString(
  search: string,
  filters: BrowseFilters,
  defaultFilter: BrowseFilters,
): string {
  const params = new URLSearchParams(search);
  const query = getApplicableBrowseFilters(filters, defaultFilter);

  for (const key of browseFilterKeys) {
    params.delete(browseFilterQueryParamMap[key]);
  }
  for (const [qsKey, value] of Object.entries(query)) {
    params.set(qsKey, value);
  }

  return params.toString();
}
