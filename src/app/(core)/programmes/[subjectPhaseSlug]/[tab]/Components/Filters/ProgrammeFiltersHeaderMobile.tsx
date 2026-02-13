import React, { Fragment, useId } from "react";
import {
  OakSpan,
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
  buildTextDescribingFilter,
  highlightedUnitCount,
} from "@/utils/curriculum/filteringApp";
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
  const targetElement = document.getElementById(`year-${yearOption}`);
  if (targetElement) {
    const headerOffset = 280;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const { pageYOffset } = globalThis;
    const offsetPosition = elementPosition + pageYOffset - headerOffset;
    globalThis.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    globalThis.addEventListener(
      "scrollend",
      () => {
        const yearHeading = document.getElementById(`year-${yearOption} h3`);
        if (yearHeading instanceof HTMLElement) {
          yearHeading.setAttribute("tabindex", "-1");
          yearHeading.focus();
        }
      },
      { once: true },
    );
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

  const highlightedUnits = highlightedUnitCount(
    yearData,
    filters,
    filters.threads,
  );

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

  const textItemsDescribingFilter = buildTextDescribingFilter(data, filters);

  const shouldIncludeCore = slugs.ks4OptionSlug !== "core";
  const mobileFilters = {
    ...filters,
    years: Object.keys(data.yearData),
    pathways: [],
  };

  const unitsByYearSelector = applyFiltering(
    mobileFilters,
    groupUnitsByPathway({
      modes: getModes(
        shouldIncludeCore,
        ks4Options ?? [],
        mobileFilters.pathways[0],
      ),
      yearData: data.yearData,
    }),
  );

  return (
    <OakBox
      $position={["sticky", "static"]}
      $display={["block", "none"]}
      $top="spacing-0"
      $zIndex={"fixed-header"}
    >
      <OakFlex
        $gap={"spacing-16"}
        $flexDirection={"column"}
        $width={"100%"}
        $background={"bg-primary"}
        data-test-id="filter-mobiles"
        $pv="spacing-32"
      >
        <OakFlex $gap={"spacing-8"} $flexDirection={"column"}>
          <OakHeading tag="h2" $font={"heading-7"}>
            Filters
          </OakHeading>
          {textItemsDescribingFilter.length > 0 && (
            <OakBox
              $textOverflow={"ellipsis"}
              $whiteSpace={"nowrap"}
              $maxWidth={"100%"}
              $overflow={"hidden"}
            >
              {textItemsDescribingFilter.map(
                (textItemDescribingFilter, index) => {
                  return (
                    <Fragment key={textItemDescribingFilter}>
                      {index > 0 && <OakBox $display={"inline"}> • </OakBox>}
                      <OakBox
                        $display={"inline"}
                        data-testid="highlighted-threads-mobile"
                      >
                        {textItemDescribingFilter}
                      </OakBox>
                    </Fragment>
                  );
                },
              )}
              {filters.threads.length > 0 && (
                <>
                  <OakBox $display={"inline"}> • </OakBox>
                  <OakBox
                    $display={"inline"}
                    data-testid="highlighted-units-box-mobile"
                  >
                    <OakSpan aria-live="polite" aria-atomic="true">
                      {highlightedUnits} units highlighted
                    </OakSpan>
                  </OakBox>
                </>
              )}
            </OakBox>
          )}
        </OakFlex>

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
          defaultValue={selectedYear}
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
        <OakTertiaryButton
          isTrailingIcon
          iconName="filter"
          onClick={onOpenModal}
          data-testid="mobile-all-filters"
        >
          All filters
        </OakTertiaryButton>
      </OakFlex>
    </OakBox>
  );
}
