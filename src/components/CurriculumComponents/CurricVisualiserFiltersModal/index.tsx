import React from "react";
import { OakFlex, OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import CurriculumVisualiserFiltersDesktop, {
  CurriculumVisualiserFiltersProps,
} from "../CurricVisualiserFiltersDesktop";

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
  trackingData,
}: CurriculumVisualiserFiltersMobileProps) {
  return (
    <OakBox
      $background={"white"}
      $position="fixed"
      $top="all-spacing-0"
      $height={"100%"}
      $zIndex={"modal-dialog"}
      $display={["block", "none"]}
    >
      <OakFlex $flexDirection={"column"} $height={"100%"}>
        <OakFlex
          $width={"100%"}
          $flexShrink={1}
          $overflowY={"scroll"}
          $position={"relative"}
          $pa={"inner-padding-m"}
        >
          <CurriculumVisualiserFiltersDesktop
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
            trackingData={trackingData}
          />
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
    </OakBox>
  );
}
