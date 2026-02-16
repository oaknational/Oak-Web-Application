import React from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

import { CurricFiltersYears } from "@/components/CurriculumComponents/CurricVisualiserFilters/CurricFiltersYears";

export type MobileFilterHeaderProps = ProgrammePageFiltersProps & {
  onOpenModal: () => void;
};
export default function ProgrammeFiltersHeaderMobile({
  onOpenModal,
  filters,
  data,
  slugs,
  ks4Options,
  onChangeFilters,
}: Readonly<MobileFilterHeaderProps>) {
  return (
    <OakBox
      $position="sticky"
      $display="block"
      $top="spacing-0"
      $zIndex={"fixed-header"}
    >
      <OakFlex
        $gap={"spacing-12"}
        $flexDirection={"column"}
        $width={"100%"}
        $background={"bg-primary"}
        data-test-id="filter-mobiles"
        $pv="spacing-32"
        $ph={"spacing-32"}
      >
        <OakHeading tag="h2" $font={"heading-7"} $mb={"spacing-8"}>
          Filters
        </OakHeading>

        <CurricFiltersYears
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          ks4Options={ks4Options}
          slugs={slugs}
          context={"integrated-journey"}
        />
        {/* Container to return focus to on filter modal close */}
        <OakBox id="all-filters-button-container">
          <OakTertiaryButton
            isTrailingIcon
            iconName="filter"
            onClick={onOpenModal}
            data-testid="mobile-all-filters"
          >
            All filters
          </OakTertiaryButton>
        </OakBox>
      </OakFlex>
    </OakBox>
  );
}
