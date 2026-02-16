import {
  OakFlex,
  OakHeading,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import React from "react";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { shouldDisplayFilter } from "@/utils/curriculum/filteringApp";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import {
  CurricFiltersYears,
  CurricFiltersSubjectCategories,
  CurricFiltersChildSubjects,
  CurricFiltersTiers,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { KeystageSlug } from "@/node-lib/curriculum-api-2023/shared.schema";

// TD: [integrated journey] this component duplicated CurricVisualiserFiltersDesktop
// once the integrated journey is launched we can remove that component

export type ProgrammePageFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
  ks4Options: Ks4Option[];
};

export default function ProgrammePageFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
}: Readonly<ProgrammePageFiltersProps>) {
  const selectedKeystage = filters.keystages[0];
  return (
    <OakFlex
      $mr={"spacing-16"}
      $gap={"spacing-32"}
      $flexDirection={"column"}
      $mb={"spacing-32"}
    >
      <SkipLink href="#content">Skip to units</SkipLink>
      {shouldDisplayFilter(data, filters, "years") && (
        <CurricFiltersYears
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          ks4Options={ks4Options}
          slugs={slugs}
          context={"integrated-journey"}
        />
      )}
      {shouldDisplayFilter(data, filters, "subjectCategories") && (
        <CurricFiltersSubjectCategories
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          slugs={slugs}
          context="integrated-journey"
        />
      )}
      {/* TD: [integrated-journey] we may remove this filter from the main page */}
      <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
        <OakHeading tag="h4" $font="heading-7">
          Key stage
        </OakHeading>
        <OakRadioGroup
          name="keystage-filters"
          onChange={(e) => {
            const ksOption = e.target.value;
            const keystages = ksOption === "all-ks" ? [] : [ksOption];
            onChangeFilters({ ...filters, keystages });
          }}
          $flexDirection={"row"}
          $flexWrap={"wrap"}
          value={selectedKeystage ?? "all-ks"}
        >
          <OakRadioAsButton key="all-ks" value="all-ks" displayValue="All" />
          {data.keystages
            .toSorted((a, b) => a.localeCompare(b))
            .map((ksSlug: KeystageSlug) => (
              <OakRadioAsButton
                key={ksSlug}
                value={ksSlug}
                displayValue={ksSlug.toUpperCase()}
              />
            ))}
        </OakRadioGroup>
      </OakFlex>
      {shouldDisplayFilter(data, filters, "childSubjects") && (
        <CurricFiltersChildSubjects
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
        />
      )}
      {shouldDisplayFilter(data, filters, "tiers") && (
        <CurricFiltersTiers
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
        />
      )}
      {/* TD: [integrated journey] add thread filters */}
    </OakFlex>
  );
}
