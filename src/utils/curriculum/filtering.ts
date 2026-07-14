import { ReadonlyURLSearchParams } from "next/navigation";
import { isEqual } from "lodash";

import { findFirstMatchingFeatures } from "./features";
import {
  sortChildSubjects,
  sortSubjectCategoriesOnFeatures,
  sortTiers,
} from "./sorting";
import {
  CurriculumFilters,
  KeyStageSlug,
  Subject,
  SubjectCategory,
  Thread,
  Tier,
  Unit,
  YearData,
} from "./types";
import { isVisibleUnit } from "./isVisibleUnit";
import {
  byKeyStageSlug,
  keystageYearMappings,
  presentAtKeyStageSlugs,
} from "./keystage";

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
  const set = new Set<Pick<SubjectCategory, "slug" | "id">>();
  Object.values(data).forEach((yearData) => {
    yearData.subjectCategories.forEach((subjectCategory) =>
      set.add({ id: subjectCategory.id, slug: subjectCategory.slug }),
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
    .map((s) => String(s.slug));
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
    pathways: [],
    keystages: [],
  };
}

export const FILTER_TO_QS: Record<keyof CurriculumFilters, string> = {
  childSubjects: "child_subjects",
  subjectCategories: "subject_categories",
  tiers: "tiers",
  years: "years",
  threads: "threads",
  pathways: "pathways",
  keystages: "keystages",
};

export function filtersToQuery(
  filter: CurriculumFilters,
  defaultFilter: CurriculumFilters,
) {
  const out: Record<string, string> = {};
  for (const [keyUntyped, value] of Object.entries(filter)) {
    const key = keyUntyped as keyof CurriculumFilters;
    if (value.length > 0) {
      if (!isEqual(defaultFilter[key], value)) {
        out[FILTER_TO_QS[key]] = value.join(",");
      }
    }
  }
  return out;
}

export function mergeInFilterParams(
  filter: CurriculumFilters,
  params?: ReadonlyURLSearchParams | URLSearchParams | null,
) {
  const out = { ...filter };
  if (params) {
    for (const keyStr of Object.keys(filter)) {
      const key = keyStr as keyof CurriculumFilters;
      const paramsValue = params.get(FILTER_TO_QS[key]);
      if (paramsValue && paramsValue !== "") {
        out[key] = params.get(FILTER_TO_QS[key])!.split(",");
      }
    }
  }
  return out;
}

export function getFilterData(
  yearData: CurriculumUnitsYearData,
  years: string[],
) {
  const childSubjects = new Map<string, Subject>();
  const subjectCategories = new Map<string, SubjectCategory>();
  const tiers = new Map<string, Tier>();
  years.forEach((year) => {
    const obj = yearData[year];
    if (obj) {
      obj.childSubjects.forEach((childSubject) =>
        childSubjects.set(childSubject.subject_slug, childSubject),
      );
      obj.tiers.forEach((tier) => tiers.set(tier.tier_slug, tier));
      obj.subjectCategories.forEach((subjectCategory) =>
        subjectCategories.set(subjectCategory.slug, subjectCategory),
      );
    }
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

export function filteringFromYears(
  yearData: YearData[number],
  filters: CurriculumFilters,
) {
  const { childSubjects, subjectCategories, tiers } = yearData;
  const output = {
    childSubjects: childSubjects.length > 0 ? filters.childSubjects : undefined,
    subjectCategories:
      childSubjects.length < 1 && subjectCategories.length > 0
        ? filters.subjectCategories
        : undefined,
    tiers: tiers.length > 0 ? filters.tiers : undefined,
    years: filters.years,
    threads: filters.threads,
    pathways: filters.pathways,
    keystages: filters.keystages,
  };
  return output;
}

export function highlightedUnitCount(
  yearData: YearData,
  filters: CurriculumFilters,
  selectedThreads: Thread["slug"][] | null,
): number {
  let count = 0;
  const effectiveYears = scopeYearsToKeystageFilter(filters);
  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    if (units && effectiveYears.includes(year)) {
      units.forEach((unit) => {
        const yearBasedFilters = filteringFromYears(yearDataItem, filters);

        if (
          isVisibleUnit(yearBasedFilters, year, unit) &&
          isHighlightedUnit(unit, selectedThreads)
        ) {
          count++;
        }
      });
    }
  });
  return count;
}

/**
 * When a keystage filter is active and years is at its default (all years),
 * returns only the years belonging to the active keystage(s). Mirrors the
 * applyFiltering logic in by-pathway.ts so filter visibility matches the unit list.
 */
export function scopeYearsToKeystageFilter(
  filters: CurriculumFilters,
): string[] {
  const selectingAllYears = filters.years.length > 1;
  if (!selectingAllYears || filters.keystages.length === 0) {
    return filters.years;
  }

  return filters.years.filter((year) =>
    filters.keystages.some((ks) =>
      keystageYearMappings[ks as KeyStageSlug]?.includes(year),
    ),
  );
}

export function shouldDisplayFilter(
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
  key: "years" | "subjectCategories" | "childSubjects" | "tiers" | "threads",
) {
  const effectiveYears = scopeYearsToKeystageFilter(filters);
  const keyStageSlugData = byKeyStageSlug(data.yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    effectiveYears,
  );

  const subjectCategoriesAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "subjectCategories",
    effectiveYears,
  ).filter((ks) => !childSubjectsAt.includes(ks));

  if (key === "years") {
    // only show year options when there is more than 1, because all content will be in a year
    // so a single year option is equivalent to the 'all' option
    return data.yearOptions.length > 1;
  }
  if (key === "subjectCategories") {
    return subjectCategoriesAt.length > 0;
  }
  if (key === "childSubjects") {
    return childSubjectsAt.length > 0;
  }
  if (key === "tiers") {
    const tiersAt = presentAtKeyStageSlugs(
      keyStageSlugData,
      "tiers",
      effectiveYears,
    );
    return tiersAt.length > 0;
  }
  if (key === "threads") {
    return data.threadOptions.length > 0;
  }
}

export function subjectCategoryForFilter(
  data: CurriculumUnitsFormattedData,
  filter: CurriculumFilters,
) {
  const slug = filter.subjectCategories[0];
  if (!slug) return;

  return Object.entries(data.yearData)
    .flatMap(([, yearDataItem]) => {
      return yearDataItem.subjectCategories;
    })
    .find((subjectCategory) => String(subjectCategory.slug) === slug);
}

export function childSubjectForFilter(
  data: CurriculumUnitsFormattedData,
  filter: CurriculumFilters,
) {
  const slug = filter.childSubjects[0];
  if (!slug) return;
  return Object.entries(data.yearData)
    .flatMap(([, yearDataItem]) => {
      return yearDataItem.childSubjects;
    })
    .find((childSubject) => childSubject.subject_slug === slug);
}

export function getNumberOfSelectedUnits(
  yearData: YearData,
  filters: CurriculumFilters,
): number {
  let count = 0;

  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    const yearBasedFilters = filteringFromYears(yearDataItem, filters);

    if (units && filters.years.includes(year)) {
      const filteredUnits = units.filter((unit: Unit) => {
        return isVisibleUnit(yearBasedFilters, year, unit);
      });

      count += filteredUnits.length;
    }
  });

  return count;
}

type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Resolves the filter from raw search params (server-side)
 * Converts PageSearchParms into a CurriculumFilters with URL params applied
 * Used in page.tsx to pre-resolve filters before SSR
 */
export function resolveFilterFromSearchParams(
  data: CurriculumUnitsFormattedData,
  searchParams: RawSearchParams | undefined,
): CurriculumFilters {
  const defaultFilter = getDefaultFilter(data);
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v == null) continue;
      if (Array.isArray(v)) {
        v.forEach((item) => {
          params.append(k, item);
        });
      } else {
        params.append(k, v);
      }
    }
  }

  return mergeInFilterParams(defaultFilter, params);
}
