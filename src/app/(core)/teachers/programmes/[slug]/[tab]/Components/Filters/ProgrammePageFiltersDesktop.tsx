import { OakFlex } from "@oaknational/oak-components";
import React from "react";

import type { Ks4OptionFilterDimension } from "../../buildKs4OptionFilterDimensions";

import { KS4OptionFocusScope } from "./KS4OptionFocus";
import { ProgrammeFilters } from "./ProgrammeFilters";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
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
  ks4OptionFilterDimensions: Record<string, Ks4OptionFilterDimension>;
};

export default function ProgrammePageFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: Readonly<ProgrammePageFiltersProps>) {
  return (
    <OakFlex
      $mr={"spacing-16"}
      $gap={"spacing-32"}
      $flexDirection={"column"}
      $mb={"spacing-32"}
    >
      <SkipLink href="#content">Skip to units</SkipLink>
      <KS4OptionFocusScope variant="page">
        <ProgrammeFilters
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          slugs={slugs}
          ks4Options={ks4Options}
          ks4OptionFilterDimensions={ks4OptionFilterDimensions}
        />
      </KS4OptionFocusScope>
    </OakFlex>
  );
}
