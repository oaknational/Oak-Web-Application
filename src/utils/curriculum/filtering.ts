import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { isEqual } from "lodash";

import { ENABLE_FILTERS_IN_SEARCH_PARAMS } from "./constants";
import { findFirstMatchingFeatures } from "./features";
import {
  sortChildSubjects,
  sortSubjectCategoriesOnFeatures,
  sortTiers,
} from "./sorting";
import {
  CurriculumFilters,
  Subject,
  SubjectCategory,
  Thread,
  Tier,
  Unit,
  YearData,
} from "./types";
import { isVisibleUnit } from "./isVisibleUnit";
import { byKeyStageSlug, presentAtKeyStageSlugs } from "./keystage";

import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsYearData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

export function getDefaultChildSubjectForYearGroup(
  data: CurriculumUnitsYearData,
) {
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
export function getDefaultSubjectCategoriesForYearGroup(
  data: CurriculumUnitsYearData,
) {
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
  if (subjectCategories.length > 0) {
    return [subjectCategories[0]!];
  }
  return [];
}
export function getDefaultTiersForYearGroup(data: CurriculumUnitsYearData) {
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
    childSubjects: getDefaultChildSubjectForYearGroup(data.yearData),
    subjectCategories: getDefaultSubjectCategoriesForYearGroup(data.yearData),
    tiers: getDefaultTiersForYearGroup(data.yearData),
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

export function isHighlightedUnit(
  unit: Unit,
  selectedThreads: Thread["slug"][] | null,
) {
  if (!selectedThreads) {
    return false;
  }
  return unit.threads.some((t) => selectedThreads.includes(t.slug));
}

export function highlightedUnitCount(
  yearData: YearData,
  filters: CurriculumFilters,
  selectedThreads: Thread["slug"][] | null,
): number {
  let count = 0;
  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;
    if (units && filters.years.includes(year)) {
      units.forEach((unit) => {
        if (
          isVisibleUnit(filters, year, unit) &&
          isHighlightedUnit(unit, selectedThreads)
        ) {
          count++;
        }
      });
    }
  });
  return count;
}

export function shouldDisplayFilter(
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
  key: "years" | "subjectCategories" | "childSubjects" | "tiers" | "threads",
) {
  const keyStageSlugData = byKeyStageSlug(data.yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    filters.years,
  );

  const subjectCategoriesAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "subjectCategories",
    filters.years,
  ).filter((ks) => !childSubjectsAt.includes(ks));

  if (key === "years") {
    return data.yearOptions.length > 0;
  }
  if (key === "subjectCategories") {
    return subjectCategoriesAt.length > 0;
  }
  if (key === "childSubjects") {
    return childSubjectsAt.length > 0;
  }
  if (key === "tiers") {
    const tiersAt = presentAtKeyStageSlugs(keyStageSlugData, "tiers");
    return tiersAt.length > 0;
  }
  if (key === "threads") {
    return data.threadOptions.length > 0;
  }
}

export function diffFilters(
  dfltFilter: CurriculumFilters,
  filters: CurriculumFilters,
) {
  const out: CurriculumFilters = {
    childSubjects: [],
    subjectCategories: [],
    tiers: [],
    years: [],
    threads: [],
  };
  for (const keyRaw of Object.keys(dfltFilter)) {
    const key = keyRaw as keyof CurriculumFilters;
    if (!isEqual(dfltFilter[key], filters[key])) {
      out[key] = filters[key];
    }
  }
  return out;
}

export function getNumberOfFiltersApplied(
  dfltFilter: CurriculumFilters,
  filters: CurriculumFilters,
) {
  const diff = diffFilters(dfltFilter, filters);
  return Object.values(diff).reduce((acc, curr) => {
    if (curr.length) {
      return acc + 1;
    }
    return acc;
  }, 0);
}
