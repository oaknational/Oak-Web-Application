import React from "react";
import { OakFlex } from "@oaknational/oak-components";

import { CurricVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurricFiltersThreads } from "../CurricVisualiserFilters/CurricFiltersThreads";
import { CurricFiltersTiers } from "../CurricVisualiserFilters/CurricFiltersTiers";
import { CurricFiltersChildSubjects } from "../CurricVisualiserFilters/CurricFiltersChildSubjects";
import { CurricFiltersSubjectCategories } from "../CurricVisualiserFilters/CurricFiltersSubjectCategories";

import { shouldDisplayFilter } from "@/utils/curriculum/filtering";

export type CurricVisualiserFiltersMobileProps =
  CurricVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
  };

export function CurricMobileFilterModal({
  data,
  filters,
  onChangeFilters,
  slugs,
}: CurricVisualiserFiltersMobileProps) {
  return (
    <OakFlex $flexDirection={"column"} $height={"100%"}>
      <OakFlex
        $flexShrink={1}
        $overflowY={"auto"}
        $position={"relative"}
        $pa={"inner-padding-l"}
      >
        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-m2"}
          $width={"100vw"}
        >
          {shouldDisplayFilter(data, filters, "subjectCategories") && (
            <CurricFiltersSubjectCategories
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              slugs={slugs}
            />
          )}

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

          {shouldDisplayFilter(data, filters, "threads") && (
            <CurricFiltersThreads
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
            />
          )}
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
