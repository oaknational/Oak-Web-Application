import { sortChildSubjects, sortTiers } from "./sorting";
import { Subject, Tier, Unit } from "./types";

import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsYearData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

export function getDefaultChildSubject(units: Unit[]) {
  const set = new Set<Subject>();
  units.forEach((u) => {
    if (u.subject_parent) {
      set.add({
        subject_slug: u.subject_slug,
        subject: u.subject,
      });
    }
  });
  const childSubjects = [...set]
    .toSorted(sortChildSubjects)
    .map((t) => t.subject_slug);
  if (childSubjects.length > 0) {
    return [childSubjects[0]!];
  }
  return [];
}
export function getDefaultSubjectCategories(units: Unit[]) {
  const set = new Set<string>();
  units.forEach((u) => {
    u.subjectcategories?.forEach((sc) => set.add(String(sc.id)));
  });
  return [[...set][0]!];
}
export function getDefaultTiers(units: Unit[]) {
  const set = new Set<Tier>();
  units.forEach((u) => {
    if (u.tier_slug && u.tier) {
      set.add({
        tier_slug: u.tier_slug,
        tier: u.tier,
      });
    }
  });
  const tiers = [...set].toSorted(sortTiers).map((t) => t.tier_slug);
  if (tiers.length > 0) {
    return [tiers[0]!];
  }
  return [];
}

function unitsFrom(yearData: CurriculumUnitsYearData): Unit[] {
  return Object.entries(yearData).flatMap(([, data]) => data.units);
}

export function getDefaultFilter(data: CurriculumUnitsFormattedData) {
  const units = unitsFrom(data.yearData);

  return {
    childSubjects: getDefaultChildSubject(units),
    subjectCategories: getDefaultSubjectCategories(units),
    tiers: getDefaultTiers(units),
    years: data.yearOptions,
    threads: [],
  };
}
