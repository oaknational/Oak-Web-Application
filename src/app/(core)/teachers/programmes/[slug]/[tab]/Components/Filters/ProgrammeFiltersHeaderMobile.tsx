import React from "react";
import {
  OakBox,
  OakFlex,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

export type MobileFilterHeaderProps = ProgrammePageFiltersProps & {
  onOpenModal: () => void;
};
export default function ProgrammeFiltersHeaderMobile({
  onOpenModal,
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
        // Container to return focus to on filter modal close
        id="mobile-filters-header-container"
      >
        <OakBox $display={["block", "block", "none"]}>
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
