import { ReadonlyURLSearchParams } from "next/navigation";

import {
  browseFilterQueryParamMap,
  BrowseFilters,
  browseFilterKeys,
  filterValueSchemas,
} from "../types";

type MaybeSearchParams = ReadonlyURLSearchParams | URLSearchParams | null;

export function applySearchParamsToFilter(
  filter: BrowseFilters,
  params?: MaybeSearchParams,
): BrowseFilters;
export function applySearchParamsToFilter(
  filter: Partial<BrowseFilters>,
  params?: MaybeSearchParams,
): Partial<BrowseFilters>;

export function applySearchParamsToFilter(
  filter: Partial<BrowseFilters>,
  params?: MaybeSearchParams,
): Partial<BrowseFilters> {
  const out = { ...filter };
  if (params) {
    for (const key of browseFilterKeys) {
      if (!(key in filter)) {
        continue;
      }

      const paramsValue = params.get(browseFilterQueryParamMap[key]);
      if (paramsValue && paramsValue !== "") {
        const result = filterValueSchemas
          .partial()
          .safeParse({ [key]: paramsValue.split(",") });

        if (result.success) {
          Object.assign(out, result.data);
        }
      }
    }
  }
  return out;
}
