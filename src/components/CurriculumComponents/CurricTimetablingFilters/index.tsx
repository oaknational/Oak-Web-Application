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
    <OakBox $mr={"spacing-16"}>
      <SkipLink href="#content">Skip to units</SkipLink>
      <OakHeading tag="h3" $font={"heading-5"} $mb="spacing-24">
        Filter and highlight
      </OakHeading>
      <CurricFiltersYears
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
        ks4Options={null}
        slugs={slugs}
        context="curriculum-visualiser"
      />
      <OakBox $mt={"spacing-32"}>
        <OakSecondaryButton>Add next year</OakSecondaryButton>
      </OakBox>
      <OakHandDrawnHR hrColor={"bg-interactive-element2"} $mv={"spacing-32"} />
      <CurricFiltersThreads
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
      />
    </OakBox>
  );
}
