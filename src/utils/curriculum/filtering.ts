import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
import { isEqual } from "lodash";
import { useRouter } from "next/router";

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
import { isCurricRoutingEnabled } from "./flags";

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
  };
}

const FILTER_TO_QS: Record<keyof CurriculumFilters, string> = {
  childSubjects: "child_subjects",
  subjectCategories: "subject_categories",
  tiers: "tiers",
  years: "years",
  threads: "threads",
  pathways: "pathways",
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

export function useFilters(
  defaultFilter: CurriculumFilters,
): [CurriculumFilters, (newFilters: CurriculumFilters) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setLocalFilters] = useState<CurriculumFilters>(defaultFilter);
  useLayoutEffect(() => {
    if (isCurricRoutingEnabled()) {
      setLocalFilters(mergeInFilterParams(defaultFilter, searchParams));
    } else {
      setLocalFilters(defaultFilter);
    }
  }, [searchParams, defaultFilter]);

  const setFilters = useCallback(
    (newFilters: CurriculumFilters) => {
      if (isCurricRoutingEnabled()) {
        const url =
          location.pathname +
          "?" +
          new URLSearchParams(
            Object.entries(filtersToQuery(newFilters, defaultFilter)),
          ).toString();
        router.replace(url, undefined, {
          shallow: true,
          scroll: false,
        });
      }
      setLocalFilters(newFilters);
    },
    [router, defaultFilter],
  );

  return [filters, setFilters];
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
  const { childSubjects, subjectCategories, tiers } = yearData!;
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
  };
  return output;
}

export function highlightedUnitCount(
  yearData: YearData,
  filters: CurriculumFilters,
  selectedThreads: Thread["slug"][] | null,
): number {
  let count = 0;
  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    if (units && filters.years.includes(year)) {
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
  defaultFilterFilter: CurriculumFilters,
  filters: CurriculumFilters,
) {
  const out: CurriculumFilters = {
    childSubjects: [],
    subjectCategories: [],
    tiers: [],
    years: [],
    threads: [],
    pathways: [],
  };
  for (const keyRaw of Object.keys(defaultFilterFilter)) {
    const key = keyRaw as keyof CurriculumFilters;
    if (!isEqual(defaultFilterFilter[key], filters[key])) {
      out[key] = filters[key];
    }
  }
  return out;
}

export function getNumberOfFiltersApplied(
  defaultFilterFilter: CurriculumFilters,
  filters: CurriculumFilters,
) {
  const diff = diffFilters(defaultFilterFilter, filters);
  return Object.values(diff).reduce((acc, curr) => {
    if (curr.length) {
      return acc + 1;
    }
    return acc;
  }, 0);
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

export function tierForFilter(
  data: CurriculumUnitsFormattedData,
  filter: CurriculumFilters,
) {
  const slug = filter.tiers[0];
  if (!slug) return;
  return Object.entries(data.yearData)
    .flatMap(([, yearDataItem]) => {
      return yearDataItem.tiers;
    })
    .find((tier) => tier.tier_slug === slug);
}

export function threadForFilter(
  data: CurriculumUnitsFormattedData,
  filter: CurriculumFilters,
) {
  const slug = filter.threads[0];
  if (!slug) return;
  return data.threadOptions.find((thread) => thread.slug === slug);
}

export function buildTextDescribingFilter(
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
) {
  const subjectCategoryField =
    filters.subjectCategories.length > 0
      ? filters.subjectCategories[0] === "all"
        ? "All categories"
        : `${subjectCategoryForFilter(data, filters)?.title}${keystageSuffixForFilter(data, filters, "subjectCategories") ? ` ${keystageSuffixForFilter(data, filters, "subjectCategories")}` : ""}`
      : undefined;

  const childSubjectField = childSubjectForFilter(data, filters)?.subject;
  const childSubjectSuffix = keystageSuffixForFilter(
    data,
    filters,
    "childSubjects",
  );
  const childSubjectWithSuffix =
    childSubjectField && childSubjectSuffix
      ? `${childSubjectField} ${childSubjectSuffix}`
      : childSubjectField;

  const tierField = tierForFilter(data, filters)?.tier;
  const tierSuffix = keystageSuffixForFilter(data, filters, "tiers");
  const tierWithSuffix =
    tierField && tierSuffix ? `${tierField} ${tierSuffix}` : tierField;

  const fields = [
    subjectCategoryField,
    childSubjectWithSuffix,
    tierWithSuffix,
    threadForFilter(data, filters)?.title,
  ].filter(Boolean);

  return fields;
}

export function keystageSuffixForFilter(
  data: CurriculumUnitsFormattedData,
  filter: CurriculumFilters,
  filterType:
    | "subjectCategories"
    | "childSubjects"
    | "tiers" = "subjectCategories",
): string | undefined {
  if (!filter[filterType].length) {
    return undefined;
  }

  const filterId = filter[filterType][0];
  if (!filterId || filterId === "-1") {
    return undefined;
  }

  const yearsWithChildSubjects: string[] = [];
  const yearsWithoutChildSubjects: string[] = [];

  Object.entries(data.yearData).forEach(([year, yearData]) => {
    let hasFilter = false;

    if (filterType === "subjectCategories") {
      hasFilter = yearData.subjectCategories.some((sc) => sc.slug === filterId);
    } else if (filterType === "childSubjects") {
      hasFilter = yearData.childSubjects.some(
        (cs) => cs.subject_slug === filterId,
      );
    } else if (filterType === "tiers") {
      hasFilter = yearData.tiers.some((t) => t.tier_slug === filterId);
    }

    if (hasFilter) {
      if (yearData.childSubjects && yearData.childSubjects.length > 0) {
        yearsWithChildSubjects.push(year);
      } else {
        yearsWithoutChildSubjects.push(year);
      }
    }
  });

  // Prioritise years without child subjects if available
  const relevantYears =
    yearsWithoutChildSubjects.length > 0
      ? yearsWithoutChildSubjects
      : yearsWithChildSubjects;

  if (relevantYears.length > 0) {
    const sortedYears = [...relevantYears].sort(
      (a, b) => Number(a) - Number(b),
    );

    const hasKS1 = sortedYears.some(
      (year) => Number(year) >= 1 && Number(year) <= 2,
    );
    const hasKS2 = sortedYears.some(
      (year) => Number(year) >= 3 && Number(year) <= 6,
    );
    const hasKS3 = sortedYears.some(
      (year) => Number(year) >= 7 && Number(year) <= 9,
    );
    const hasKS4 = sortedYears.some(
      (year) => Number(year) >= 10 && Number(year) <= 11,
    );

    // Handle combined key stages
    if ((hasKS1 && hasKS2) || (hasKS3 && hasKS4)) {
      return "";
    }

    // If not combined, proceed with single key stage logic
    const firstYear = Number(sortedYears[0]);

    if (firstYear >= 1 && firstYear <= 2) {
      return "(KS1)";
    } else if (firstYear >= 3 && firstYear <= 6) {
      return "(KS2)";
    } else if (firstYear >= 7 && firstYear <= 9) {
      return "(KS3)";
    } else if (firstYear >= 10 && firstYear <= 11) {
      return "(KS4)";
    }
  }

  return undefined;
}

export function getNumberOfSelectedUnits(
  yearData: YearData,
  filters: CurriculumFilters,
): number {
  let count = 0;

  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    const yearBasedFilters = filteringFromYears(yearDataItem!, filters);

    if (units && filters.years.includes(year)) {
      const filteredUnits = units.filter((unit: Unit) => {
        return isVisibleUnit(yearBasedFilters, year, unit);
      });

      count += filteredUnits.length;
    }
  });

  return count;
}
