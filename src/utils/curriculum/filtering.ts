import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { ENABLE_FILTERS_IN_SEARCH_PARAMS } from "./constants";
import {
  sortChildSubjects,
  sortSubjectCategoriesOnFeatures,
  sortTiers,
} from "./sorting";
import { CurriculumFilters, Subject, SubjectCategory, Tier } from "./types";

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

function filtersToQuery(filter: CurriculumFilters) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(filter)) {
    if (value.length > 0) {
      out[key] = value.join(",");
    }
  }
  return out;
}

function mergeInParams(
  filter: CurriculumFilters,
  params?: ReadonlyURLSearchParams | null,
) {
  const out = { ...filter };
  if (params) {
    for (const keyStr of Object.keys(filter)) {
      const key = keyStr as keyof CurriculumFilters;
      const paramsValue = params.get(key);
      if (paramsValue && paramsValue !== "") {
        out[key] = params.get(key)!.split(",");
      }
    }
  }
  return out;
}

export function useFilters(
  defaultFiltersFn: () => CurriculumFilters,
): [CurriculumFilters, (newFilters: CurriculumFilters) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setLocalFilters] = useState<CurriculumFilters>(() => {
    const dflt = defaultFiltersFn();
    if (ENABLE_FILTERS_IN_SEARCH_PARAMS) {
      return mergeInParams(dflt, searchParams);
    } else {
      return dflt;
    }
  });
  const setFilters = (newFilters: CurriculumFilters) => {
    if (ENABLE_FILTERS_IN_SEARCH_PARAMS) {
      const url =
        location.pathname +
        "?" +
        new URLSearchParams(
          Object.entries(filtersToQuery(newFilters)),
        ).toString();
      router.replace(url, undefined, { shallow: true });
    }
    setLocalFilters(newFilters);
  };

  return [filters, setFilters];
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
    sortSubjectCategoriesOnFeatures(null),
  );
  const tiersArray = [...tiers.values()].toSorted(sortTiers);

  return {
    childSubjects: childSubjectsArray,
    subjectCategories: subjectCategoriesArray,
    tiers: tiersArray,
  };
}
