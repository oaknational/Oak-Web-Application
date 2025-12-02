import React, { useState, Fragment, ReactNode } from "react";
import {
  OakSpan,
  OakBox,
  OakSecondaryLink,
  OakFlex,
  OakSmallPrimaryButton,
  OakSmallSecondaryButton,
  OakPrimaryButtonProps,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { ProgrammePageMobileFiltersProps } from "./MobileFilters";

import {
  getYearGroupTitle,
  getPathwaySuffix,
} from "@/utils/curriculum/formatting";
import {
  buildTextDescribingFilter,
  highlightedUnitCount,
} from "@/utils/curriculum/filtering";
import {
  applyFiltering,
  getModes,
  groupUnitsByPathway,
} from "@/utils/curriculum/by-pathway";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";

export type MobileFilterHeaderProps = ProgrammePageMobileFiltersProps & {
  onOpenModal: () => void;
};

const StyledButton = (
  props: OakPrimaryButtonProps & {
    children: ReactNode;
    onClick: () => void;
    "aria-pressed": boolean;
  },
) =>
  props["aria-pressed"] ? (
    <OakSmallPrimaryButton {...props} />
  ) : (
    <OakSmallSecondaryButton {...props} />
  );

const ScrollableWrapper = styled.div`
  position: relative;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 20px;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 25px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const StyledButtonGroup = styled(OakFlex)`
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  & > *:first-child {
    margin-left: 16px;
  }

  & > *:not(:last-child) {
    margin-right: -5px;
  }
`;

export default function ProgrammeFiltersHeaderMobile({
  onOpenModal,
  filters,
  data,
  selectedYear,
  onSelectYear,
  slugs,
  ks4Options,
}: MobileFilterHeaderProps) {
  //   const { track } = useAnalytics();
  //   const { analyticsUseCase } = useAnalyticsPageProps();
  const [lockYear, setLockYear] = useState<string | null>(null);

  const { yearData } = data;

  const highlightedUnits = highlightedUnitCount(
    yearData,
    filters,
    filters.threads,
  );

  const shouldDisplayCorePathway =
    slugs.ks4OptionSlug !== "core" && getShouldDisplayCorePathway(ks4Options);

  // TD: [integrated journey] analytics
  //   function trackSelectYear(year: string): void {
  //     if (trackingData) {
  //   const analyticsData = buildUnitSequenceRefinedAnalytics(
  //     analyticsUseCase,
  //     trackingData,
  //     {
  //       ...filters,
  //       years: [year],
  //     },
  //   );
  //   track.unitSequenceRefined(analyticsData);
  //     }
  //   }

  function isSelectedYear(yearOption: string) {
    return selectedYear === `year-${yearOption}`;
  }

  function scrollToYearSection(yearOption: string) {
    const targetElement = document.getElementById(`year-${yearOption}`);
    if (targetElement) {
      const headerOffset = 140;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const { pageYOffset } = window;
      const offsetPosition = elementPosition + pageYOffset - headerOffset;

      setLockYear(yearOption);
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.addEventListener(
        "scrollend",
        () => {
          setLockYear(null);
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
      <OakBox
        $width={"100%"}
        $background={"white"}
        $mb="spacing-8"
        data-test-id="filter-mobiles"
      >
        <OakBox>
          <OakBox $ph={"spacing-16"} $pv={"spacing-16"} $mv="spacing-16">
            <OakSpan $font={"body-1-bold"}>
              <OakSecondaryLink
                element="button"
                iconName="chevron-right"
                isTrailingIcon
                onClick={onOpenModal}
                data-testid="mobile-highlight-thread"
              >
                Filter and highlight
              </OakSecondaryLink>
            </OakSpan>
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
                      <Fragment key={index}>
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
          </OakBox>
          <OakBox
            $bt={"border-solid-s"}
            $bb={"border-solid-s"}
            $borderColor={"grey30"}
            $width={"100%"}
            data-testid={"year-selection-mobile"}
          >
            <ScrollableWrapper>
              <StyledButtonGroup aria-label="Select a year group">
                {unitsByYearSelector.map(({ type, year }) => {
                  const yearOption = `${type}-${year}`;
                  const isYearSelected = lockYear
                    ? lockYear === yearOption
                    : isSelectedYear(yearOption);
                  return (
                    <OakBox key={yearOption} $pt="spacing-8" $ml="spacing-4">
                      <FocusIndicator
                        data-testid="year-group-focus-indicator"
                        $display={"inline-block"}
                        $mb="spacing-8"
                        $mr="spacing-8"
                        $background={isYearSelected ? "black" : "white"}
                        $color={isYearSelected ? "white" : "black"}
                        $borderRadius={"border-radius-s"}
                        $font="heading-7"
                        disableMouseHover={isSelectedYear(yearOption)}
                      >
                        {/* TD: [integrated journey] update to use new button with selected state? */}
                        <StyledButton
                          data-testid="year-group-filter-button"
                          aria-pressed={isSelectedYear(yearOption)}
                          onClick={() => {
                            onSelectYear(yearOption);
                            // trackSelectYear(yearOption);
                            scrollToYearSection(yearOption);
                          }}
                        >
                          {getYearGroupTitle(
                            yearData,
                            year,
                            (() => {
                              const suffix = shouldDisplayCorePathway
                                ? getPathwaySuffix(year, type)
                                : undefined;
                              return suffix ? `(${suffix})` : undefined;
                            })(),
                          )}
                        </StyledButton>
                      </FocusIndicator>
                    </OakBox>
                  );
                })}
              </StyledButtonGroup>
            </ScrollableWrapper>
          </OakBox>
        </OakBox>
      </OakBox>
    </OakBox>
  );
}
