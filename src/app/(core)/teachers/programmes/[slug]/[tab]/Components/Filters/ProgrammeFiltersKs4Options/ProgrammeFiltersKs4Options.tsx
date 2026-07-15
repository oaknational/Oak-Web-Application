"use client";

import {
  OakBox,
  OakP,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { useId } from "react";

import type { Ks4OptionFilterDimension } from "../../../buildKs4OptionFilterDimensions";
import { useGetKs4OptionFocusNavigationQuery } from "../KS4OptionFocus/KS4OptionFocusScope";

import {
  getPreservedQuery,
  getSubjectPhaseSlugForKs4Option,
  partitionKs4Options,
  shouldDisplayExamBoardFilter,
  shouldDisplayPathwayFilter,
} from "./programmeFiltersKs4Options.helpers";

import { resolveOakHref } from "@/common-lib/urls";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { sortKs4OptionsForDisplay } from "@/utils/curriculum/sorting";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";

export type ProgrammeFiltersKs4OptionsProps = {
  filters: CurriculumFilters;
  slugs: CurriculumSelectionSlugs;
  ks4Options: Ks4Option[];
  ks4OptionFilterDimensions: Record<string, Ks4OptionFilterDimension>;
  onChangeFilters?: unknown;
  data?: unknown;
};

export function ProgrammeFiltersKs4Options({
  filters,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: Readonly<ProgrammeFiltersKs4OptionsProps>) {
  const router = useRouter();
  const getKs4OptionFocusNavigationQuery =
    useGetKs4OptionFocusNavigationQuery();
  const { pathwayOptions, examBoardOptions } = partitionKs4Options(ks4Options);
  const showPathway = shouldDisplayPathwayFilter(slugs, filters, ks4Options);
  const showExamBoard = shouldDisplayExamBoardFilter(
    slugs,
    filters,
    ks4Options,
  );

  if (!showPathway && !showExamBoard) {
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

  const selectedSlug = slugs.ks4OptionSlug ?? "";

  return (
    <>
      {showPathway && (
        <Ks4OptionRadioGroup
          legend="Pathway (KS4)"
          namePrefix="pathway"
          options={pathwayOptions}
          selectedSlug={selectedSlug}
          onSelect={onKs4OptionChange}
        />
      )}
      {showExamBoard && (
        <Ks4OptionRadioGroup
          legend="Exam board (KS4)"
          namePrefix="exam-board"
          options={examBoardOptions}
          selectedSlug={selectedSlug}
          onSelect={onKs4OptionChange}
        />
      )}
    </>
  );
}

type Ks4OptionRadioGroupProps = {
  legend: string;
  namePrefix: string;
  options: Ks4Option[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

function Ks4OptionRadioGroup({
  legend,
  namePrefix,
  options,
  selectedSlug,
  onSelect,
}: Readonly<Ks4OptionRadioGroupProps>) {
  const id = useId();
  const sortedOptions = sortKs4OptionsForDisplay(options);

  return (
    <OakBox>
      <OakRadioGroup
        name={`${namePrefix}-${id}`}
        onChange={(e) => onSelect(e.target.value)}
        value={selectedSlug}
        $flexDirection="row"
        $flexWrap="wrap"
        $gap="spacing-8"
      >
        <OakP as="legend" $font="heading-7" $mt="spacing-0" $mb="spacing-16">
          {legend}
        </OakP>
        {sortedOptions.map((option) => (
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
