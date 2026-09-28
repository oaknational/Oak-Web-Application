import { BrowseFilters } from "../types";

const BASE_FILTERS: BrowseFilters = {
  childSubjects: [],
  subjectCategories: [],
  tiers: [],
  years: [],
  threads: [],
  pathways: [],
  keystages: [],
};

export function createFilter(partial: Partial<BrowseFilters> = {}) {
  return {
    ...BASE_FILTERS,
    ...partial,
  };
}
