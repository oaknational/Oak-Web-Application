import { CurriculumFilters } from "./types";

import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

export type PartialFilters = {
  childSubjects?: CurriculumFilters["childSubjects"];
  subjectCategories?: CurriculumFilters["subjectCategories"];
  tiers?: CurriculumFilters["tiers"];
  years: CurriculumFilters["years"];
  threads: CurriculumFilters["threads"];
  pathways: CurriculumFilters["pathways"];
};

export function evalCondition(query: string, slug: string) {
  const isNot = query.match(/^!/);
  const target = query.replace(/^!/, "");

  let ret = false;
  if (isNot) {
    ret = slug !== target;
  } else {
    ret = slug === target;
  }

  return ret;
}

export function isVisibleUnit(
  filters: PartialFilters,
  year: string,
  unit: CurriculumUnitsTabData["units"][number],
) {
  if (!filters.years.includes(year)) {
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

  const filterByPathways =
    !filters.pathways?.[0] ||
    !unit.pathway_slug ||
    evalCondition(filters.pathways[0], unit.pathway_slug);

  return (
    filterBySubject &&
    filterBySubjectCategory &&
    filterByTier &&
    filterByPathways
  );
}
