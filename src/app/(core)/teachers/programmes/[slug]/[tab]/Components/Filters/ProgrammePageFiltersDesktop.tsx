import { OakFlex } from "@oaknational/oak-components";
import React from "react";

import { ProgrammeFilters } from "./ProgrammeFilters";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import type { ExamboardFilterDimension } from "@/node-lib/curriculum-api-2023";

// TD: [integrated journey] this component duplicated CurricVisualiserFiltersDesktop
// once the integrated journey is launched we can remove that component

export type ProgrammePageFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
  ks4Options: Ks4Option[];
  examboardFilterDimensions: Record<string, ExamboardFilterDimension>;
};

export default function ProgrammePageFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
  examboardFilterDimensions,
}: Readonly<ProgrammePageFiltersProps>) {
  return (
    <OakFlex
      $mr={"spacing-16"}
      $gap={"spacing-32"}
      $flexDirection={"column"}
      $mb={"spacing-32"}
    >
      <SkipLink href="#content">Skip to units</SkipLink>
      <ProgrammeFilters
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
        slugs={slugs}
        ks4Options={ks4Options}
        examboardFilterDimensions={examboardFilterDimensions}
      />
    </OakFlex>
  );
}
