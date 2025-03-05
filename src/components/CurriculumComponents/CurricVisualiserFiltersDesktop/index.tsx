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

import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  byKeyStageSlug,
  presentAtKeyStageSlugs,
} from "@/utils/curriculum/keystage";

export type CurriculumVisualiserFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  trackingData: CurriculumUnitsTrackingData;
};

function shouldDisplay(
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
  key: "years" | "subjectCategories" | "childSubjects" | "tiers" | "threads",
) {
  const keyStageSlugData = byKeyStageSlug(data.yearData);
  const childSubjectsAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "childSubjects",
    filters.years,
  );
  const subjectCategoriesAt = presentAtKeyStageSlugs(
    keyStageSlugData,
    "subjectCategories",
    filters.years,
  ).filter((ks) => !childSubjectsAt.includes(ks));

  if (key === "years") {
    return data.yearOptions.length > 0;
  }
  if (key === "subjectCategories") {
    return subjectCategoriesAt.length > 0;
  }
  if (key === "childSubjects") {
    return childSubjectsAt.length > 0;
  }
  if (key === "tiers") {
    const tiersAt = presentAtKeyStageSlugs(keyStageSlugData, "tiers");
    return tiersAt.length > 0;
  }
  if (key === "threads") {
    return data.threadOptions.length > 0;
  }
}

export default function CurriculumVisualiserFiltersDesktop({
  filters,
  onChangeFilters,
  data,
}: CurriculumVisualiserFiltersProps) {
  return (
    <OakBox $mr={"space-between-s"}>
      <SkipLink href="#content">Skip to units</SkipLink>

      <OakHeading tag="h3" $font={"heading-5"} $mb="space-between-m">
        Filter and highlight
      </OakHeading>

      {shouldDisplay(data, filters, "years") && (
        <>
          <CurricFiltersYears
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />
        </>
      )}

      {shouldDisplay(data, filters, "subjectCategories") && (
        <>
          <CurricFiltersSubjectCategories
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />
        </>
      )}

      {shouldDisplay(data, filters, "childSubjects") && (
        <>
          <CurricFiltersChildSubjects
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />
        </>
      )}
      {shouldDisplay(data, filters, "tiers") && (
        <>
          <CurricFiltersTiers
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
          <OakHandDrawnHR
            hrColor={"grey40"}
            $mt={"space-between-m"}
            $mb={"space-between-m2"}
          />
        </>
      )}

      {shouldDisplay(data, filters, "threads") && (
        <>
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
