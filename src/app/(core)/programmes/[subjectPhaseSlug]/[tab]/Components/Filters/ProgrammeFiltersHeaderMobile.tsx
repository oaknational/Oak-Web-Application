import React, { useId } from "react";
import {
  OakBox,
  OakFlex,
  OakRadioAsButton,
  OakRadioGroup,
  OakHeading,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { ProgrammePageMobileFiltersProps } from "./ProgrammePageFiltersMobile";

import {
  getYearGroupTitle,
  getPathwaySuffix,
} from "@/utils/curriculum/formatting";
import {
  applyFiltering,
  getModes,
  groupUnitsByPathway,
} from "@/utils/curriculum/by-pathway";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { buildUnitSequenceRefinedAnalytics } from "@/utils/curriculum/analytics";
import { getColorSchemeByYear } from "@/components/CurriculumComponents/CurricVisualiserFilters/CurricFiltersYears";

export type MobileFilterHeaderProps = ProgrammePageMobileFiltersProps & {
  onOpenModal: () => void;
};

function scrollToYearSection(yearOption: string) {
  const yearSectionId = `year-${yearOption}`;
  const targetElement = document.getElementById(yearSectionId);

  if (targetElement) {
    const headerOffset = 270;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const { pageYOffset } = globalThis;
    const offsetPosition = elementPosition + pageYOffset - headerOffset;
    globalThis.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

export default function ProgrammeFiltersHeaderMobile({
  onOpenModal,
  filters,
  data,
  onSelectYear,
  selectedYear,
  slugs,
  ks4Options,
  trackingData,
}: MobileFilterHeaderProps) {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const id = useId();

  const { yearData } = data;

  const shouldDisplayCorePathway =
    slugs.ks4OptionSlug !== "core" && getShouldDisplayCorePathway(ks4Options);

  function trackSelectYear(year: string): void {
    if (trackingData) {
      const analyticsData = buildUnitSequenceRefinedAnalytics(
        analyticsUseCase,
        trackingData,
        {
          ...filters,
          years: [year],
        },
      );
      track.unitSequenceRefined(analyticsData);
    }
  }

  const mobileFilters = {
    ...filters,
    years: Object.keys(data.yearData),
    pathways: [],
  };

  const unitsByYearSelector = applyFiltering(
    mobileFilters,
    groupUnitsByPathway({
      modes: getModes(
        shouldDisplayCorePathway,
        ks4Options ?? [],
        mobileFilters.pathways[0],
      ),
      yearData: data.yearData,
    }),
  );

  const getSelectedYear = (selectedYear: string) => {
    // selected year container ids are in the format year-all-{yearValue} eg. "year-all-6"
    // to get the yearOption we need to strip the first "year-" from the string
    return selectedYear.slice(5);
  };

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
        $ph={"spacing-32"}
      >
        <OakHeading tag="h2" $font={"heading-7"} $mb={"spacing-8"}>
          Filters
        </OakHeading>

        <OakRadioGroup
          data-testid={"year-selection-mobile"}
          name={"year" + id}
          onChange={(event) => {
            const yearOption = event.target.value;
            onSelectYear(yearOption);
            trackSelectYear(yearOption);
            scrollToYearSection(yearOption);
          }}
          $flexDirection={"row"}
          $flexWrap={"wrap"}
          aria-label="Select a year group"
          value={getSelectedYear(selectedYear)}
        >
          {unitsByYearSelector.map(({ type, year }) => {
            const yearOption = `${type}-${year}`;
            return (
              <OakRadioAsButton
                key={yearOption}
                value={yearOption}
                width="max-content"
                data-testid="year-group-filter-button"
                displayValue={getYearGroupTitle(
                  yearData,
                  year,
                  (() => {
                    const suffix = shouldDisplayCorePathway
                      ? getPathwaySuffix(year, type)
                      : undefined;
                    return suffix ? `(${suffix})` : undefined;
                  })(),
                )}
                colorScheme={getColorSchemeByYear(year)}
              />
            );
          })}
        </OakRadioGroup>
        {/* Container to return focus to on filter modal close */}
        <OakBox id="all-filters-button-container">
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
