import { findFirstMatchingFeatures } from "./features";
import {
  sortChildSubjects,
  sortSubjectCategoriesOnFeatures,
  sortTiers,
} from "./sorting";
import { Subject, SubjectCategory, Tier } from "./types";

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
  const set = new Set<Pick<SubjectCategory, "id">>();
  Object.values(data).forEach((yearData) => {
    yearData.subjectCategories.forEach((subjectCategory) =>
      set.add({ id: subjectCategory.id }),
    );
  });
  const subjectCategories = [...set]
    .toSorted(
      sortSubjectCategoriesOnFeatures(
        findFirstMatchingFeatures(data, (unit) => {
          return unit.features?.subjectcategories?.default_category_id;
        }),
      ),
    )
    .map((s) => String(s.id));
  return [subjectCategories[0]!];
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

export function getFilterData(
  yearData: CurriculumUnitsYearData,
  years: string[],
) {
  const childSubjects = new Map<string, Subject>();
  const subjectCategories = new Map<number, SubjectCategory>();
  const tiers = new Map<string, Tier>();
  years.forEach((year) => {
    const obj = yearData[year]!;
    obj.childSubjects.forEach((childSubject) =>
      childSubjects.set(childSubject.subject_slug, childSubject),
    );
    obj.tiers.forEach((tier) => tiers.set(tier.tier_slug, tier));
    obj.subjectCategories.forEach((subjectCategory) =>
      subjectCategories.set(subjectCategory.id, subjectCategory),
    );
  });

  const childSubjectsArray = [...childSubjects.values()].toSorted(
    sortChildSubjects,
  );
  const subjectCategoriesArray = [...subjectCategories.values()].toSorted(
    sortSubjectCategoriesOnFeatures(
      findFirstMatchingFeatures(
        yearData,
        (unit) => unit.features?.subjectcategories?.default_category_id,
      ),
    ),
  );
  const tiersArray = [...tiers.values()].toSorted(sortTiers);

  return {
    childSubjects: childSubjectsArray,
    subjectCategories: subjectCategoriesArray,
    tiers: tiersArray,
  };
}
