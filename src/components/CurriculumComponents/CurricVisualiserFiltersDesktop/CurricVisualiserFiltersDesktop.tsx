import {
  OakBox,
  OakHeading,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import React from "react";

import SkipLink from "../OakComponentsKitchen/SkipLink";
import {
  CurricFiltersChildSubjects,
  CurricFiltersSubjectCategories,
  CurricFiltersThreads,
  CurricFiltersTiers,
  CurricFiltersYears,
} from "../CurricVisualiserFilters";

import { CurriculumFilters, DEFAULT_FILTERS } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { shouldDisplayFilter } from "@/utils/curriculum/filtering";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export type CurricVisualiserFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
  includeFilters?: (keyof CurriculumFilters)[];
};

export default function CurricVisualiserFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
  includeFilters = DEFAULT_FILTERS,
}: CurricVisualiserFiltersProps) {
  return (
    <OakBox $mr={"space-between-s"}>
      <SkipLink href="#content">Skip to units</SkipLink>

      <OakHeading tag="h3" $font={"heading-5"} $mb="space-between-m">
        Filter and highlight
      </OakHeading>

      {includeFilters.includes("years") &&
        shouldDisplayFilter(data, filters, "years") && (
          <>
            <CurricFiltersYears
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              ks4Options={ks4Options}
              slugs={slugs}
            />
            <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
          </>
        )}

      {includeFilters.includes("subjectCategories") &&
        shouldDisplayFilter(data, filters, "subjectCategories") && (
          <>
            <CurricFiltersSubjectCategories
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              slugs={slugs}
            />
            <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
          </>
        )}

      {includeFilters.includes("childSubjects") &&
        shouldDisplayFilter(data, filters, "childSubjects") && (
          <>
            <CurricFiltersChildSubjects
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
            />
            <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
          </>
        )}
      {includeFilters.includes("tiers") &&
        shouldDisplayFilter(data, filters, "tiers") && (
          <>
            <CurricFiltersTiers
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
            />
            <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
          </>
        )}

      {includeFilters.includes("threads") &&
        shouldDisplayFilter(data, filters, "threads") && (
          <>
            {/* TODO: This contains old style components */}
            <CurricFiltersThreads
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
            />
          </>
        )}
    </OakBox>
  );
}
