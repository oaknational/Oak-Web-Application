import { OakFlex } from "@oaknational/oak-components";
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
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

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
          context="integrated-journey"
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
      {shouldDisplayFilter(data, filters, "childSubjects") && (
        <CurricFiltersChildSubjects
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          context={"integrated-journey"}
        />
      )}
      {shouldDisplayFilter(data, filters, "tiers") && (
        <CurricFiltersTiers
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          context={"integrated-journey"}
        />
      )}
      {/* TD: [integrated journey] add thread filters */}
    </OakFlex>
  );
}
