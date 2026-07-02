"use client";
import React, { useEffect, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInformativeModal,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";
import ProgrammeFiltersHeaderMobile from "./ProgrammeFiltersHeaderMobile";
import { ProgrammeFilters } from "./ProgrammeFilters";
import { KS4OptionFocusScope } from "./KS4OptionFocus";
import { useProgrammePageFiltersModal } from "./ProgrammePageFiltersModalProvider";

import { usePrevious } from "@/hooks/usePrevious";
import { CloseAction } from "@/components/CurriculumComponents/OakComponentsKitchen/OakModalNew/Content";

export default function ProgrammePageFiltersMobile({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: Readonly<ProgrammePageFiltersProps>) {
  const { isOpen, setIsOpen } = useProgrammePageFiltersModal();

  const [initialFilterState, setInitialFilterState] = useState(() => {
    return filters;
  });

  // Only change `initialFilterState` when opening the modal
  const prevModalOpen = usePrevious(isOpen);
  useEffect(() => {
    if (isOpen && !prevModalOpen) {
      setInitialFilterState(filters);
    }
  }, [filters, isOpen, prevModalOpen]);

  function handleMobileThreadModal(): void {
    setIsOpen(!isOpen);
  }

  function onClose(action: CloseAction) {
    if (action === "close_button") {
      onChangeFilters(initialFilterState);
    }
    setIsOpen(false);
  }

  return (
    <>
      <OakInformativeModal
        onClose={onClose}
        isOpen={isOpen}
        largeScreenMaxWidth={600}
        domContainer={getDomContainer()}
        footerSlot={
          <OakBox
            $pa={"spacing-12"}
            $bt={"border-solid-s"}
            $borderColor={"border-neutral-lighter"}
          >
            <OakPrimaryButton
              data-testid="mobile-done-thread-modal-button"
              onClick={() => setIsOpen(false)}
            >
              Show results
            </OakPrimaryButton>
          </OakBox>
        }
      >
        <ModalContent
          data={data}
          filters={filters}
          onChangeFilters={onChangeFilters}
          slugs={slugs}
          ks4Options={ks4Options}
          ks4OptionFilterDimensions={ks4OptionFilterDimensions}
        />
      </OakInformativeModal>

      <ProgrammeFiltersHeaderMobile
        onOpenModal={handleMobileThreadModal}
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
        slugs={slugs}
        ks4Options={ks4Options}
        ks4OptionFilterDimensions={ks4OptionFilterDimensions}
      />
    </>
  );
}

function getDomContainer() {
  if (typeof document !== "undefined") {
    return (
      document.getElementById("mobile-filters-header-container") ?? undefined
    );
  }
}

const ModalContent = ({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: ProgrammePageFiltersProps) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $height={"100%"}
      $ph={"spacing-24"}
      $gap={"spacing-20"}
      $overflowX={"visible"}
    >
      <OakHeading $font={"heading-6"} tag="h1">
        Filters
      </OakHeading>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-32"}
        $overflowX={"visible"}
      >
        <KS4OptionFocusScope variant="modal">
          <ProgrammeFilters
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
            slugs={slugs}
            ks4Options={ks4Options}
            ks4OptionFilterDimensions={ks4OptionFilterDimensions}
          />
        </KS4OptionFocusScope>
      </OakFlex>
    </OakFlex>
  );
};
