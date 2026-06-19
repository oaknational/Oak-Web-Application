"use client";

import {
  OakBox,
  OakP,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef } from "react";

import type { ExamboardFilterDimension } from "../../buildExamboardFilterDimensions";

import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { resolveOakHref } from "@/common-lib/urls";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { scopeYearsToKeystageFilter } from "@/utils/curriculum/filtersUrl";
import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";

export const FOCUS_KS4_OPTION_QUERY_PARAM = "focus_ks4option";

export type ProgrammeFiltersExamBoardProps = {
  filters: CurriculumFilters;
  slugs: CurriculumSelectionSlugs;
  ks4Options: Ks4Option[];
  examboardFilterDimensions: Record<string, ExamboardFilterDimension>;
  // accepted but unused - required to slot into the shared filter render loop
  onChangeFilters?: unknown;
  data?: unknown;
  context?: unknown;
};

export function shouldDisplayExamBoardFilter(
  slugs: CurriculumSelectionSlugs,
  filters: CurriculumFilters,
  ks4Options: Ks4Option[],
): boolean {
  const hasExamBoardOptions = ks4Options.some((option) =>
    isExamboardSlug(option.slug),
  );
  const effectiveYears = scopeYearsToKeystageFilter(filters);
  const hasKs4YearFilter = effectiveYears.some((year) =>
    keystageYearMappings.ks4.includes(year),
  );
  const isInKs4Context =
    slugs.ks4OptionSlug !== null &&
    isExamboardSlug(slugs.ks4OptionSlug) &&
    hasKs4YearFilter;

  return (
    slugs.phaseSlug === "secondary" && isInKs4Context && hasExamBoardOptions
  );
}

function getExamBoardOptions(ks4Options: Ks4Option[]) {
  return ks4Options.filter((option) => isExamboardSlug(option.slug));
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

function stripFocusKs4OptionParam(searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(FOCUS_KS4_OPTION_QUERY_PARAM);
  const qs = params.toString();
  return qs
    ? `${globalThis.location.pathname}?${qs}`
    : globalThis.location.pathname;
}

export function getPreservedQuery(
  filters: CurriculumFilters,
  destinationSlug: string,
  examboardFilterDimensions?: Record<string, ExamboardFilterDimension>,
) {
  const keystages = filters.keystages[0];
  const years =
    filters.years.length === 1 &&
    keystageYearMappings.ks4.includes(filters.years[0]!)
      ? filters.years[0]
      : undefined;

  const destinationDims = examboardFilterDimensions?.[destinationSlug];
  const tiers = toQueryParam(
    filterCompatibleFilterValues(filters.tiers, destinationDims?.tierSlugs),
  );
  const pathways = toQueryParam(
    filterCompatibleFilterValues(
      filters.pathways,
      destinationDims?.pathwaySlugs,
    ),
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
    pathways,
    child_subjects: childSubjects,
  };
}

export function ProgrammeFiltersExamBoard({
  filters,
  slugs,
  ks4Options,
  examboardFilterDimensions,
}: Readonly<ProgrammeFiltersExamBoardProps>) {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupRef = useRef<HTMLDivElement>(null);
  const hasHandledFocusParam = useRef(false);
  const examBoardOptions = getExamBoardOptions(ks4Options);
  const isVisible = shouldDisplayExamBoardFilter(slugs, filters, ks4Options);

  // Exam board selection navigates to a new programme slug, which remounts this
  // filter and drops focus. onExamBoardChange appends a one-shot focus_ks4option
  // query param so we can restore focus here after the new page paints. The param
  // is stripped via replaceState (which does not update useSearchParams), so we
  // guard with hasHandledFocusParam to run this only once per mount.
  useEffect(() => {
    if (!isVisible || hasHandledFocusParam.current || !searchParams) {
      return;
    }

    const focusSlug = searchParams.get(FOCUS_KS4_OPTION_QUERY_PARAM);
    if (!focusSlug) {
      return;
    }

    hasHandledFocusParam.current = true;

    const matchingOption = examBoardOptions.find(
      (option) => option.slug === focusSlug,
    );

    requestAnimationFrame(() => {
      if (matchingOption) {
        const radio = groupRef.current?.querySelector<HTMLInputElement>(
          `input[type="radio"][value="${matchingOption.slug}"]`,
        );
        // Restore focus position without showing the focus ring after navigation.
        radio?.focus({ focusVisible: false } as FocusOptions);
      }

      globalThis.history.replaceState(
        null,
        "",
        stripFocusKs4OptionParam(searchParams),
      );
    });
  }, [searchParams, isVisible, examBoardOptions]);

  if (!isVisible) {
    return null;
  }

  function onExamBoardChange(selectedSlug: string) {
    const subjectPhaseSlug = getSubjectPhaseSlug({
      subject: slugs.subjectSlug,
      phaseSlug: slugs.phaseSlug,
      examBoardSlug: selectedSlug,
    });

    router.push(
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "units",
        query: {
          ...getPreservedQuery(
            filters,
            selectedSlug,
            examboardFilterDimensions,
          ),
          focus_ks4option: selectedSlug,
        },
      }),
    );
  }

  return (
    <OakBox ref={groupRef}>
      <OakRadioGroup
        name={`exam-board-${id}`}
        onChange={(e) => onExamBoardChange(e.target.value)}
        value={slugs.ks4OptionSlug ?? ""}
        $flexDirection="row"
        $flexWrap="wrap"
        $gap="spacing-8"
      >
        <OakP as="legend" $font="heading-7" $mt="spacing-0" $mb="spacing-16">
          Exam board (KS4)
        </OakP>
        {examBoardOptions.map((option) => (
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
