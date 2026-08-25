import React from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

import { BrowseFiltersYears } from "@/app/(core)/teachers/programmes/[slug]/[tab]/Components/Filters/BrowseFilters/BrowseFiltersYears";

export type MobileFilterHeaderProps = ProgrammePageFiltersProps & {
  onOpenModal: () => void;
};
export default function ProgrammeFiltersHeaderMobile({
  onOpenModal,
  data,
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
        <OakHeading tag="h2" $font={"heading-7"} $mb={"spacing-8"}>
          Filters
        </OakHeading>

        <BrowseFiltersYears data={data} onModalOpen={onOpenModal} />
        <OakBox $display={["block", "none", "none"]}>
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
