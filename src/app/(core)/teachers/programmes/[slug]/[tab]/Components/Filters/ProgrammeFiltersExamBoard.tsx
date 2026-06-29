"use client";

import {
  OakBox,
  OakP,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { useId } from "react";

import type { Ks4OptionFilterDimension } from "../../buildKs4OptionFilterDimensions";

import { useGetKs4OptionFocusNavigationQuery } from "./KS4OptionFocus/KS4OptionFocusScope";

import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { resolveOakHref } from "@/common-lib/urls";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import {
  isExamboardSlug,
  isPathwaySlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { sortKs4OptionsForDisplay } from "@/utils/curriculum/sorting";
import { scopeYearsToKeystageFilter } from "@/utils/curriculum/filtersUrl";
import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";

export type ProgrammeFiltersExamBoardProps = {
  filters: CurriculumFilters;
  slugs: CurriculumSelectionSlugs;
  ks4Options: Ks4Option[];
  ks4OptionFilterDimensions: Record<string, Ks4OptionFilterDimension>;
  // accepted but unused - required to slot into the shared filter render loop
  onChangeFilters?: unknown;
  data?: unknown;
};

export function shouldDisplayExamBoardFilter(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
  ks4Options: Ks4Option[],
): boolean {
  const hasMultipleKs4Options = ks4Options.length > 1;
  const effectiveYears = scopeYearsToKeystageFilter(filters);
  const hasKs4YearFilter = effectiveYears.some((year) =>
    keystageYearMappings.ks4.includes(year),
  );
  const isValidKs4Option =
    slugs.ks4OptionSlug !== null &&
    (isExamboardSlug(slugs.ks4OptionSlug) ||
      isPathwaySlug(slugs.ks4OptionSlug));
  const isInKs4Context = isValidKs4Option && hasKs4YearFilter;

  return (
    slugs.phaseSlug === "secondary" && isInKs4Context && hasMultipleKs4Options
  );
}

function filterCompatibleFilterValues(
  values: string[],
  compatibleSlugs: string[] | undefined,
): string[] {
  if (values.length === 0) {
    return [];
  }

  // When compatible slugs are unknown, drop rather than guess.
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

export function ProgrammeFiltersExamBoard({
  filters,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: Readonly<ProgrammeFiltersExamBoardProps>) {
  const id = useId();
  const router = useRouter();
  const getKs4OptionFocusNavigationQuery =
    useGetKs4OptionFocusNavigationQuery();
  const isVisible = shouldDisplayExamBoardFilter(slugs, filters, ks4Options);

  if (!isVisible) {
    return null;
  }

  function onKs4OptionChange(selectedSlug: string) {
    const subjectPhaseSlug = getSubjectPhaseSlugForKs4Option(
      slugs,
      selectedSlug,
    );

    router.replace(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "units",
        query: {
          ...getPreservedQuery(
            filters,
            selectedSlug,
            ks4OptionFilterDimensions,
          ),
          ...getKs4OptionFocusNavigationQuery(selectedSlug),
        },
      }),
    );
  }

  const sortedKs4Options = sortKs4OptionsForDisplay(ks4Options);

  return (
    <OakBox>
      <OakRadioGroup
        name={`exam-board-${id}`}
        onChange={(e) => onKs4OptionChange(e.target.value)}
        value={slugs.ks4OptionSlug ?? ""}
        $flexDirection="row"
        $flexWrap="wrap"
        $gap="spacing-8"
      >
        <OakP as="legend" $font="heading-7" $mt="spacing-0" $mb="spacing-16">
          Exam board (KS4)
        </OakP>
        {sortedKs4Options.map((option) => (
          <OakRadioAsButton
            key={option.slug}
            value={option.slug}
            displayValue={option.title}
          />
        ))}
      </OakRadioGroup>
    </OakBox>
  );
}
