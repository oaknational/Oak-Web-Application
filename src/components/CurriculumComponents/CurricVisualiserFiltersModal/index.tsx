import React from "react";
import { OakFlex, OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import { CurriculumVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurricFiltersYears } from "../CurricVisualiserFilters/CurricFiltersYears";
import { CurricFiltersThreads } from "../CurricVisualiserFilters/CurricFiltersThreads";
import { CurricFiltersTiers } from "../CurricVisualiserFilters/CurricFiltersTiers";
import { CurricFiltersChildSubjects } from "../CurricVisualiserFilters/CurricFiltersChildSubjects";
import { CurricFiltersSubjectCategories } from "../CurricVisualiserFilters/CurricFiltersSubjectCategories";

import { shouldDisplayFilter } from "@/utils/curriculum/filtering";

export type CurriculumVisualiserFiltersMobileProps =
  CurriculumVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
    onOpenModal: () => void;
  };

export function CurriculumMobileFilterModal({
  data,
  onOpenModal,
  filters,
  onChangeFilters,
}: CurriculumVisualiserFiltersMobileProps) {
  return (
    <OakFlex $flexDirection={"column"} $height={"100%"}>
      <OakFlex
        $width={"100%"}
        $flexShrink={1}
        $overflowY={"auto"}
        $position={"relative"}
        $pa={"inner-padding-m"}
      >
        <OakBox>
          {shouldDisplayFilter(data, filters, "years") && (
            <>
              <CurricFiltersYears
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={data}
              />
            </>
          )}

          {shouldDisplayFilter(data, filters, "subjectCategories") && (
            <>
              <CurricFiltersSubjectCategories
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={data}
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
            </>
          )}
          {shouldDisplayFilter(data, filters, "tiers") && (
            <>
              <CurricFiltersTiers
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={data}
              />
            </>
          )}

          {shouldDisplayFilter(data, filters, "threads") && (
            <>
              <CurricFiltersThreads
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={data}
              />
            </>
          )}
        </OakBox>
      </OakFlex>
      <OakFlex
        $width={"100%"}
        $background={"white"}
        $bottom={["all-spacing-0"]}
        $right={["all-spacing-0"]}
        $ph={"inner-padding-m"}
        $pv={"inner-padding-s"}
        $justifyContent={"left"}
        $bt={"border-solid-s"}
        $borderColor={"grey30"}
      >
        <OakPrimaryButton
          data-testid="mobile-done-thread-modal-button"
          onClick={onOpenModal}
          width={"100%"}
        >
          Apply
        </OakPrimaryButton>
      </OakFlex>
    </OakFlex>
  );
}
