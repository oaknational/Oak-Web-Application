import type { Ks4OptionFilterDimension } from "../../../buildKs4OptionFilterDimensions";

import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import {
  isExamboardSlug,
  isPathwaySlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { scopeYearsToKeystageFilter } from "@/utils/curriculum/filtersUrl";
import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";

export type PartitionedKs4Options = {
  pathwayOptions: Ks4Option[];
  examBoardOptions: Ks4Option[];
};

export function partitionKs4Options(
  ks4Options: Ks4Option[],
): PartitionedKs4Options {
  const pathwayOptions = ks4Options.filter((option) =>
    isPathwaySlug(option.slug),
  );
  const examBoardOptions = ks4Options.filter((option) =>
    isExamboardSlug(option.slug),
  );

  return {
    pathwayOptions,
    examBoardOptions,
  };
}

export function isInKs4FilterContext(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
): boolean {
  const effectiveYears = scopeYearsToKeystageFilter(filters);
  const hasKs4YearFilter = effectiveYears.some((year) =>
    keystageYearMappings.ks4.includes(year),
  );
  const isValidKs4Option =
    slugs.ks4OptionSlug !== null &&
    (isExamboardSlug(slugs.ks4OptionSlug) ||
      isPathwaySlug(slugs.ks4OptionSlug));

  return (
    slugs.phaseSlug === "secondary" && isValidKs4Option && hasKs4YearFilter
  );
}

function filterCompatibleFilterValues(
  values: string[],
  compatibleSlugs: string[] | undefined,
): string[] {
  if (values.length === 0) {
    return [];
  }

  if (!compatibleSlugs) {
    return [];
  }

  return values.filter((value) => compatibleSlugs.includes(value));
}

function toQueryParam(values: string[]): string | undefined {
  return values.length > 0 ? values.join(",") : undefined;
}

export function getPreservedQuery(
  filters: CurriculumFilters,
  destinationSlug: string,
  ks4OptionFilterDimensions?: Record<string, Ks4OptionFilterDimension>,
) {
  const keystages = filters.keystages[0];
  const years =
    filters.years.length === 1 &&
    keystageYearMappings.ks4.includes(filters.years[0]!)
      ? filters.years[0]
      : undefined;

  const destinationDims = ks4OptionFilterDimensions?.[destinationSlug];
  const tiers = toQueryParam(
    filterCompatibleFilterValues(filters.tiers, destinationDims?.tierSlugs),
  );
  const childSubjects = toQueryParam(
    filterCompatibleFilterValues(
      filters.childSubjects,
      destinationDims?.childSubjectSlugs,
    ),
  );

  return {
    keystages: keystages ?? undefined,
    years,
    tiers,
    child_subjects: childSubjects,
  };
}

export function getSubjectPhaseSlugForKs4Option(
  slugs: Pick<CurriculumSelectionSlugs, "subjectSlug" | "phaseSlug">,
  selectedKs4OptionSlug: string,
) {
  if (isPathwaySlug(selectedKs4OptionSlug)) {
    return getSubjectPhaseSlug({
      subject: slugs.subjectSlug,
      phaseSlug: slugs.phaseSlug,
      pathwaySlug: selectedKs4OptionSlug,
    });
  }

  return getSubjectPhaseSlug({
    subject: slugs.subjectSlug,
    phaseSlug: slugs.phaseSlug,
    examBoardSlug: selectedKs4OptionSlug,
  });
}

export function shouldDisplayPathwayFilter(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
  ks4Options: Ks4Option[],
): boolean {
  const { pathwayOptions } = partitionKs4Options(ks4Options);

  return isInKs4FilterContext(slugs, filters) && pathwayOptions.length >= 1;
}

export function shouldDisplayExamBoardFilter(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
  ks4Options: Ks4Option[],
): boolean {
  const { examBoardOptions } = partitionKs4Options(ks4Options);

  return isInKs4FilterContext(slugs, filters) && examBoardOptions.length >= 2;
}

export function shouldDisplayKs4OptionsFilter(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
  ks4Options: Ks4Option[],
): boolean {
  return (
    shouldDisplayPathwayFilter(slugs, filters, ks4Options) ||
    shouldDisplayExamBoardFilter(slugs, filters, ks4Options)
  );
}
