import { CurriculumFilters } from "@/utils/curriculum/types";

const BASE_FILTERS: CurriculumFilters = {
  childSubjects: [],
  subjectCategories: [],
  tiers: [],
  years: [],
  threads: [],
};

export function createFilter(partial: Partial<CurriculumFilters> = {}) {
  return {
    ...BASE_FILTERS,
    ...partial,
  };
}
