import React, { useEffect, useState } from "react";
import { OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import { CurricVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurricMobileStickyHeader } from "../CurricVisualiserMobileHeader";
import { CurricMobileFilterModal } from "../CurricVisualiserFiltersModal";
import { OakModalNew } from "../OakComponentsKitchen/OakModalNew";

import { usePrevious } from "@/hooks/usePrevious";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";

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
  ks4Options,
}: CurricVisualiserFiltersMobileProps) {
  const [mobileThreadModalOpen, setMobileThreadModalOpen] =
    useState<boolean>(false);

  const [initialFilterState, setInitialFilterState] = useState(() => {
    return filters;
  });

  // Only change `initialFilterState` when opening the modal
  const prevMobileThreadModalOpen = usePrevious(mobileThreadModalOpen);
  useEffect(() => {
    if (mobileThreadModalOpen && !prevMobileThreadModalOpen) {
      setInitialFilterState(filters);
    }
  }, [filters, mobileThreadModalOpen, prevMobileThreadModalOpen]);

  function handleMobileThreadModal(): void {
    setMobileThreadModalOpen(!mobileThreadModalOpen);
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
            filters={filters}
            selectedYear={selectedYear}
            onSelectYear={onSelectYear}
            onChangeFilters={onChangeFilters}
            data={data}
            slugs={slugs}
            ks4Options={ks4Options}
          />
        }
        footer={
          <OakPrimaryButton
            data-testid="mobile-done-thread-modal-button"
            onClick={() => setMobileThreadModalOpen(false)}
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
        ks4Options={ks4Options}
      />
    </>
  );
}
