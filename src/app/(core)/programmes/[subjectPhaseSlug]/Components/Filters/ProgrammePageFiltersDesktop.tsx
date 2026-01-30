import {
  OakBox,
  OakHeading,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import React from "react";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { shouldDisplayFilter } from "@/utils/curriculum/filteringApp";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import {
  CurricFiltersYears,
  CurricFiltersSubjectCategories,
  CurricFiltersChildSubjects,
  CurricFiltersTiers,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

// TD: [integrated journey] this component duplicated CurricVisualiserFiltersDesktop
// once the integrated journey is launched we can remove that component

export type ProgrammePageFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
};

export default function ProgrammePageFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
}: Readonly<ProgrammePageFiltersProps>) {
  return (
    <OakBox $mr={"spacing-16"}>
      <SkipLink href="#content">Skip to units</SkipLink>
      <OakHeading tag="h3" $font={"heading-5"} $mb="spacing-24">
        Filter and highlight
      </OakHeading>
      {shouldDisplayFilter(data, filters, "years") && (
        <>
          <CurricFiltersYears
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
            ks4Options={ks4Options}
            slugs={slugs}
          />
          <OakHandDrawnHR
            hrColor={"bg-interactive-element2"}
            $mv={"spacing-32"}
          />
        </>
      )}
      {shouldDisplayFilter(data, filters, "subjectCategories") && (
        <>
          <CurricFiltersSubjectCategories
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
            slugs={slugs}
          />
          <OakHandDrawnHR
            hrColor={"bg-interactive-element2"}
            $mv={"spacing-32"}
          />
        </>
      )}
      {shouldDisplayFilter(data, filters, "childSubjects") && (
        <>
          <CurricFiltersChildSubjects
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"bg-interactive-element2"}
            $mv={"spacing-32"}
          />
        </>
      )}
      {shouldDisplayFilter(data, filters, "tiers") && (
        <>
          <CurricFiltersTiers
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"bg-interactive-element2"}
            $mv={"spacing-32"}
          />
        </>
      )}
      {/* TD: [integrated journey] add thread filters */}
      {/* {shouldDisplayFilter(data, filters, "threads") && (
        <CurricFiltersThreads
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
        />
      )} */}
    </OakBox>
  );
}
