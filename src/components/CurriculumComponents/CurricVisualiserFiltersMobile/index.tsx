import React, { useEffect, useState } from "react";
import { OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import { CurricVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurricMobileStickyHeader } from "../CurricVisualiserMobileHeader";
import { CurricMobileFilterModal } from "../CurricVisualiserFiltersModal";
import { OakModalNew } from "../OakComponentsKitchen/OakModalNew";

import { usePrevious } from "@/hooks/usePrevious";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumFilters } from "@/utils/curriculum/types";

export type CurricVisualiserFiltersMobileProps =
  CurricVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
    onOpenModal: () => void;
    trackingData: CurriculumUnitsTrackingData;
  };
export default function CurricVisualiserFiltersMobile({
  filters,
  onChangeFilters,
  data,
  selectedYear,
  onSelectYear,
  slugs,
  trackingData,
}: CurricVisualiserFiltersMobileProps) {
  const [mobileThreadModalOpen, setMobileThreadModalOpen] =
    useState<boolean>(false);

  const [initialFilterState, setInitialFilterState] = useState(() => {
    return filters;
  });

  const [tempFilters, setTempFilters] = useState<CurriculumFilters>(filters);

  // Only change `initialFilterState` when opening the modal
  const prevMobileThreadModalOpen = usePrevious(mobileThreadModalOpen);
  useEffect(() => {
    if (mobileThreadModalOpen && !prevMobileThreadModalOpen) {
      setInitialFilterState(filters);
      setTempFilters(filters);
    }
  }, [filters, mobileThreadModalOpen, prevMobileThreadModalOpen]);

  function handleMobileThreadModal(): void {
    setMobileThreadModalOpen(!mobileThreadModalOpen);
  }

  function handleApply() {
    onChangeFilters(tempFilters);
    setMobileThreadModalOpen(false);
  }

  function onClose() {
    onChangeFilters(initialFilterState);
    setMobileThreadModalOpen(false);
  }

  return (
    <>
      <OakModalNew
        open={mobileThreadModalOpen}
        onClose={onClose}
        title={<OakBox $font={"heading-6"}>Filter and highlight</OakBox>}
        content={
          <CurricMobileFilterModal
            filters={tempFilters}
            selectedYear={selectedYear}
            onSelectYear={onSelectYear}
            onChangeFilters={setTempFilters}
            data={data}
            slugs={slugs}
          />
        }
        footer={
          <OakPrimaryButton
            data-testid="mobile-done-thread-modal-button"
            onClick={handleApply}
            width={"100%"}
          >
            Apply
          </OakPrimaryButton>
        }
      />
      <CurricMobileStickyHeader
        onOpenModal={handleMobileThreadModal}
        filters={filters}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
        onChangeFilters={onChangeFilters}
        data={data}
        slugs={slugs}
        trackingData={trackingData}
      />
    </>
  );
}
