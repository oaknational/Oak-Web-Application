import React, { useState } from "react";

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
    <CurriculumMobileFilterModal
      onOpenModal={handleMobileThreadModal}
      filters={filters}
      selectedYear={selectedYear}
      onSelectYear={onSelectYear}
      onChangeFilters={onChangeFilters}
      data={data}
      trackingData={trackingData}
    />
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
