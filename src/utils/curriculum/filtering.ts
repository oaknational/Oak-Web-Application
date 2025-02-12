import { sortChildSubjects, sortTiers } from "./sorting";
import { Subject, Tier } from "./types";

import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsYearData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

export function getDefaultChildSubject(data: CurriculumUnitsYearData) {
  const set = new Set<Subject>();
  Object.values(data).forEach((yearData) => {
    yearData.childSubjects.forEach((childSubject) => {
      set.add({
        subject_slug: childSubject.subject_slug,
        subject: childSubject.subject,
      });
    });
  });
  const childSubjects = [...set]
    .toSorted(sortChildSubjects)
    .map((t) => t.subject_slug);
  if (childSubjects.length > 0) {
    return [childSubjects[0]!];
  }
  return [];
}
export function getDefaultSubjectCategories(data: CurriculumUnitsYearData) {
  const set = new Set<string>();
  Object.values(data).forEach((yearData) => {
    yearData.subjectCategories.forEach((subjectCategory) =>
      set.add(String(subjectCategory.id)),
    );
  });
  return [[...set][0]!];
}
export function getDefaultTiers(data: CurriculumUnitsYearData) {
  const set = new Set<Tier>();
  Object.values(data).forEach((yearData) => {
    yearData.tiers.forEach((tier) => {
      set.add({
        tier_slug: tier.tier_slug,
        tier: tier.tier,
      });
    });
  });
  const tiers = [...set].toSorted(sortTiers).map((t) => t.tier_slug);
  if (tiers.length > 0) {
    return [tiers[0]!];
  }
  return [];
}

export function getDefaultFilter(data: CurriculumUnitsFormattedData) {
  return {
    childSubjects: getDefaultChildSubject(data.yearData),
    subjectCategories: getDefaultSubjectCategories(data.yearData),
    tiers: getDefaultTiers(data.yearData),
    years: data.yearOptions,
    threads: [],
  };
}
