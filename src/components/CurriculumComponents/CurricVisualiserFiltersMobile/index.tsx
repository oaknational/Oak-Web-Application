import React, { useEffect, useRef, useState } from "react";
import { OakBox, OakPrimaryButton } from "@oaknational/oak-components";

import { CurricVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";
import { CurricMobileStickyHeader } from "../CurricVisualiserMobileHeader";
import { CurricMobileFilterModal } from "../CurricVisualiserFiltersModal";
import { OakModalNew } from "../OakComponentsKitchen/OakModalNew";

import { usePrevious } from "@/hooks/usePrevious";

export type CurricVisualiserFiltersMobileProps =
  CurricVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
    onOpenModal: () => void;
  };
export default function CurricVisualiserFiltersMobile({
  filters,
  onChangeFilters,
  data,
  trackingData,
  selectedYear,
  onSelectYear,
}: CurricVisualiserFiltersMobileProps) {
  const ref = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    if (ref.current) {
      if (mobileThreadModalOpen) {
        document.body.style.overflow = "hidden";
        ref.current.showModal();
      } else {
        document.body.style.overflow = "";
        ref.current.close();
      }
    }
  }, [ref, mobileThreadModalOpen]);

  function onClose() {
    onChangeFilters(initialFilterState);
    setMobileThreadModalOpen(false);
  }

  return (
    <>
      <OakModalNew
        open={mobileThreadModalOpen}
        onClose={onClose}
        title={<OakBox $font={"body-1-bold"}>Filter and highlight</OakBox>}
        content={
          <CurricMobileFilterModal
            filters={filters}
            selectedYear={selectedYear}
            onSelectYear={onSelectYear}
            onChangeFilters={onChangeFilters}
            data={data}
            trackingData={trackingData}
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
        trackingData={trackingData}
      />
    </>
  );
}
