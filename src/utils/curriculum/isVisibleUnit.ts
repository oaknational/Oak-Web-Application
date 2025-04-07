import { CurriculumFilters } from "./types";

import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

export type PartialFilters = {
  childSubjects?: CurriculumFilters["childSubjects"];
  subjectCategories?: CurriculumFilters["subjectCategories"];
  tiers?: CurriculumFilters["tiers"];
  years: CurriculumFilters["years"];
  threads: CurriculumFilters["threads"];
};

export function isVisibleUnit(
  filters: PartialFilters,
  year: string,
  unit: CurriculumUnitsTabData["units"][number],
  isExamboard: boolean,
) {
  if (!filters.years.includes(year)) {
    return false;
  }

  if (isExamboard && unit.pathway_slug === "core") {
    return false;
  }

  const filterBySubject =
    !filters.childSubjects?.[0] ||
    filters.childSubjects[0] === unit.subject_slug;

  const filterBySubjectCategory =
    !filters.subjectCategories?.[0] ||
    (filters.subjectCategories.length > 0 &&
      filters.subjectCategories?.[0] === "-1") ||
    unit.subjectcategories?.findIndex(
      (subjectcategory) =>
        String(subjectcategory.id) === filters.subjectCategories?.[0],
    ) !== -1;

  const filterByTier =
    !filters.tiers?.[0] ||
    !unit.tier_slug ||
    filters.tiers[0] === unit.tier_slug;

  return filterBySubject && filterBySubjectCategory && filterByTier;
}
