import { browseFilterQueryParamMap, BrowseFilters } from "../types";

/**
 * Compares the given filters to the default filters and returns
 * those which need to be applied, ie. are different from the default
 */

export function getApplicableBrowseFilters(
  filters: BrowseFilters,
  defaultFilters: BrowseFilters,
) {
  const out: Record<string, string> = {};
  for (const [keyUntyped, value] of Object.entries(filters)) {
    const key = keyUntyped as keyof BrowseFilters;
    if (value.length > 0) {
      if (!areFilterValuesEqual(defaultFilters[key], value)) {
        out[browseFilterQueryParamMap[key]] = value.join(",");
      }
    }
  }
  return out;
}

const areFilterValuesEqual = (first: string[], second: string[]): boolean => {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
};
