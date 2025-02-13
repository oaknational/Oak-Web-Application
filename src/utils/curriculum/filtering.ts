import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { sortChildSubjects, sortTiers } from "./sorting";
import { CurriculumFilters, Subject, Tier, Unit } from "./types";
import { ENABLE_FILTERS_IN_SEARCH_PARAMS } from "./constants";

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
