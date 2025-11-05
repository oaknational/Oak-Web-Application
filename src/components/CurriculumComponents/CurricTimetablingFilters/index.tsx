import {
  OakBox,
  OakHeading,
  OakHandDrawnHR,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import SkipLink from "../OakComponentsKitchen/SkipLink";
import {
  CurricFiltersThreads,
  CurricFiltersYears,
} from "../CurricVisualiserFilters";

import { CurriculumFilters } from "@/utils/curriculum/types";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export type CurricVisualiserFiltersProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  slugs: CurriculumSelectionSlugs;
};

export default function CurricTimetablingFilters({
  filters,
  onChangeFilters,
  data,
  slugs,
}: Readonly<CurricVisualiserFiltersProps>) {
  return (
    <OakBox $mr={"space-between-s"}>
      <SkipLink href="#content">Skip to units</SkipLink>

      <OakHeading tag="h3" $font={"heading-5"} $mb="space-between-m">
        Filter and highlight
      </OakHeading>

      <CurricFiltersYears
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
        ks4Options={null}
        slugs={slugs}
      />

      <OakBox $mt={"space-between-m2"}>
        <OakSecondaryButton>Add next year</OakSecondaryButton>
      </OakBox>

      <OakHandDrawnHR hrColor={"grey40"} $mv={"space-between-m2"} />

      <CurricFiltersThreads
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
      />
    </OakBox>
  );
}
