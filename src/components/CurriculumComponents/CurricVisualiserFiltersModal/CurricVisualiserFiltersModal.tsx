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
        $pa={"spacing-20"}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-32"} $width={"100vw"}>
          {shouldDisplayFilter(data, filters, "subjectCategories") && (
            <CurricFiltersSubjectCategories
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              slugs={slugs}
              context="curriculum-visualiser"
            />
          )}

          {shouldDisplayFilter(data, filters, "childSubjects") && (
            <CurricFiltersChildSubjects
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              context={"curriculum-visualiser"}
            />
          )}
          {shouldDisplayFilter(data, filters, "tiers") && (
            <CurricFiltersTiers
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              context={"curriculum-visualiser"}
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
