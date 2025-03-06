import React, { useState } from "react";
import { OakBox } from "@oaknational/oak-components";

import { CurriculumVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurriculumMobileStickyHeader } from "../CurricVisualiserMobileHeader";
import { CurriculumMobileFilterModal } from "../CurricVisualiserFiltersModal";

export type CurriculumVisualiserFiltersMobileProps =
  CurriculumVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
    onOpenModal: () => void;
  };
export default function CurriculumVisualiserFiltersMobile({
  filters,
  onChangeFilters,
  data,
  trackingData,
  selectedYear,
  onSelectYear,
}: CurriculumVisualiserFiltersMobileProps) {
  const [mobileThreadModalOpen, setMobileThreadModalOpen] =
    useState<boolean>(false);

  function handleMobileThreadModal(): void {
    setMobileThreadModalOpen(!mobileThreadModalOpen);
  }

  return mobileThreadModalOpen ? (
    <OakBox
      $background={"white"}
      $position="fixed"
      $top="all-spacing-0"
      $height={"100%"}
      $zIndex={"modal-dialog"}
      $display={["block", "none"]}
    >
      <CurriculumMobileFilterModal
        onOpenModal={handleMobileThreadModal}
        filters={filters}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
        onChangeFilters={onChangeFilters}
        data={data}
        trackingData={trackingData}
      />
    </OakBox>
  ) : (
    <CurriculumMobileStickyHeader
      onOpenModal={handleMobileThreadModal}
      filters={filters}
      selectedYear={selectedYear}
      onSelectYear={onSelectYear}
      onChangeFilters={onChangeFilters}
      data={data}
      trackingData={trackingData}
    />
  );
}
