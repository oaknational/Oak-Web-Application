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
} from "../CurricVisualiserFilters";

import { CurriculumFilters } from "@/utils/curriculum/types";
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
};

export default function CurricVisualiserFiltersDesktop({
  filters,
  onChangeFilters,
  data,
  slugs,
}: CurricVisualiserFiltersProps) {
  return (
    <OakBox $mr={"space-between-s"}>
      <SkipLink href="#content">Skip to units</SkipLink>

      <OakHeading tag="h3" $font={"heading-5"} $mb="space-between-m">
        Filter and highlight
      </OakHeading>

      {/* {shouldDisplayFilter(data, filters, "years") && (
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
      )} */}

      {shouldDisplayFilter(data, filters, "subjectCategories") && (
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

      {shouldDisplayFilter(data, filters, "childSubjects") && (
        <>
          <CurricFiltersChildSubjects
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
        </>
      )}
      {shouldDisplayFilter(data, filters, "tiers") && (
        <>
          <CurricFiltersTiers
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />
        </>
      )}

      {shouldDisplayFilter(data, filters, "threads") && (
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
