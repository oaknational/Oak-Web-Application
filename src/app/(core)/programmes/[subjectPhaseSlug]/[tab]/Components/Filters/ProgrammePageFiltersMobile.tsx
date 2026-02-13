import React, { useEffect, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakInformativeModal,
  OakInformativeModalBody,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";
import ProgrammeFiltersHeaderMobile from "./ProgrammeFiltersHeaderMobile";

import { usePrevious } from "@/hooks/usePrevious";
import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CloseAction } from "@/components/CurriculumComponents/OakComponentsKitchen/OakModalNew/Content";
import {
  CurricFiltersSubjectCategories,
  CurricFiltersChildSubjects,
  CurricFiltersTiers,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import { shouldDisplayFilter } from "@/utils/curriculum/filteringApp";

export type ProgrammePageMobileFiltersProps = ProgrammePageFiltersProps & {
  selectedYear: string;
  onSelectYear: (newYear: string) => void;
  trackingData: CurriculumUnitsTrackingData;
};

export default function ProgrammePageFiltersMobile({
  filters,
  onChangeFilters,
  data,
  selectedYear,
  onSelectYear,
  slugs,
  trackingData,
  ks4Options,
}: ProgrammePageMobileFiltersProps) {
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
          <OakPrimaryButton
            data-testid="mobile-done-thread-modal-button"
            onClick={() => setMobileThreadModalOpen(false)}
            width={"100%"}
          >
            Show results
          </OakPrimaryButton>
        }
      >
        <OakInformativeModalBody>
          <OakBox $font={"heading-6"}>Filter and highlight</OakBox>
          <ModalContent
            data={data}
            filters={filters}
            onChangeFilters={onChangeFilters}
            slugs={slugs}
          />
        </OakInformativeModalBody>
      </OakInformativeModal>

      <ProgrammeFiltersHeaderMobile
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

const ModalContent = ({
  filters,
  onChangeFilters,
  data,
  slugs,
}: Pick<
  ProgrammePageMobileFiltersProps,
  "data" | "filters" | "onChangeFilters" | "slugs"
>) => {
  return (
    <OakFlex $flexDirection={"column"} $height={"100%"}>
      <OakFlex
        $flexShrink={1}
        $overflowY={"auto"}
        $position={"relative"}
        $pa={"spacing-20"}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-32"} $width={"100vw"}>
          {shouldDisplayFilter(data, filters, "subjectCategories") && (
            <CurricFiltersSubjectCategories
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              slugs={slugs}
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
    </OakFlex>
  );
};
