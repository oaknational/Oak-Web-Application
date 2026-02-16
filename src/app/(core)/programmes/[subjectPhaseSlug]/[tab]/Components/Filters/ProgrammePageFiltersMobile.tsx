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

import { usePrevious } from "@/hooks/usePrevious";
import { CloseAction } from "@/components/CurriculumComponents/OakComponentsKitchen/OakModalNew/Content";
import {
  CurricFiltersSubjectCategories,
  CurricFiltersChildSubjects,
  CurricFiltersTiers,
  CurricFiltersYears,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import { shouldDisplayFilter } from "@/utils/curriculum/filteringApp";

export default function ProgrammePageFiltersMobile({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
}: Readonly<ProgrammePageFiltersProps>) {
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

  function onClose(action: CloseAction) {
    if (action === "close_button") {
      onChangeFilters(initialFilterState);
    }
    setMobileThreadModalOpen(false);
  }

  return (
    <>
      <OakInformativeModal
        onClose={onClose}
        isOpen={mobileThreadModalOpen}
        largeScreenMaxWidth={600}
        domContainer={
          document.getElementById("all-filters-button-container") ?? undefined
        }
        footerSlot={
          <OakBox
            $pa={"spacing-12"}
            $bt={"border-solid-s"}
            $borderColor={"border-neutral-lighter"}
          >
            <OakPrimaryButton
              data-testid="mobile-done-thread-modal-button"
              onClick={() => setMobileThreadModalOpen(false)}
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
        />
      </OakInformativeModal>

      <ProgrammeFiltersHeaderMobile
        onOpenModal={handleMobileThreadModal}
        filters={filters}
        onChangeFilters={onChangeFilters}
        data={data}
        slugs={slugs}
        ks4Options={ks4Options}
      />
    </>
  );
}

const ModalContent = ({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
}: Pick<
  ProgrammePageFiltersProps,
  "data" | "filters" | "onChangeFilters" | "slugs" | "ks4Options"
>) => {
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
        <CurricFiltersYears
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={data}
          slugs={slugs}
          ks4Options={ks4Options}
          context="integrated-journey"
        />
        {shouldDisplayFilter(data, filters, "subjectCategories") && (
          <CurricFiltersSubjectCategories
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
            slugs={slugs}
            context="integrated-journey"
          />
        )}

        {shouldDisplayFilter(data, filters, "childSubjects") && (
          <CurricFiltersChildSubjects
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
        )}
        {shouldDisplayFilter(data, filters, "tiers") && (
          <CurricFiltersTiers
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={data}
          />
        )}
      </OakFlex>
    </OakFlex>
  );
};
