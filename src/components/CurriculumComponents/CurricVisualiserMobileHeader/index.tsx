import React, { useState } from "react";
import { OakFlex, OakSpan, OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

import FocusIndicator from "../OakComponentsKitchen/FocusIndicator";
import { CurricVisualiserFiltersProps } from "../CurricVisualiserFiltersDesktop";

import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button/Button";
import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { Thread } from "@/utils/curriculum/types";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";

export type CurriculumVisualiserFiltersMobileProps =
  CurricVisualiserFiltersProps & {
    selectedYear: string;
    onSelectYear: (newYear: string) => void;
    onOpenModal: () => void;
  };

const StyledButton = styled("button")`
  all: unset;
  color: inherit;
  cursor: pointer;
  padding: 12px;
  width: fit-content;
  display: inline-block;
  white-space: nowrap;
  border-radius: 4px;
  margin-right: 0;
  border: 1px solid ${({ theme }) => theme.colors.grey40};

  &:hover:not([aria-pressed="true"]) {
    background: #f2f2f2;
  }
`;

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

const StyledButtonGroup = styled(ButtonGroup)`
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

export function CurricMobileStickyHeader({
  onOpenModal,
  filters,
  data,
  trackingData,
  selectedYear,
  onSelectYear,
}: CurriculumVisualiserFiltersMobileProps) {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const [lockYear, setLockYear] = useState<string | null>(null);

  const { yearData, threadOptions, yearOptions } = data;

  const selectedThread = filters.threads[0];

  const highlightedUnits = highlightedUnitCount(
    yearData,
    filters,
    filters.threads,
  );

  function trackSelectYear(year: string): void {
    if (trackingData) {
      const { subjectTitle, subjectSlug } = trackingData;
      track.yearGroupSelected({
        yearGroupName: year,
        yearGroupSlug: year,
        subjectTitle,
        subjectSlug,
        analyticsUseCase: analyticsUseCase,
      });
    }
  }

  const threadDef = (selectedThread: Thread["slug"]) =>
    threadOptions.find((t) => t.slug === selectedThread);

  function isSelectedYear(yearOption: string) {
    return selectedYear === yearOption;
  }

  function scrollToYearSection(yearOption: string) {
    const targetElement = document.getElementById(`year-${yearOption}`);
    if (targetElement) {
      const headerOffset = 70;
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
          const yearHeading = document.getElementById(`year-${yearOption}`);
          if (yearHeading instanceof HTMLElement) {
            yearHeading.setAttribute("tabindex", "-1");
            yearHeading.focus();
          }
        },
        { once: true },
      );
    }
  }

  return (
    <OakBox
      $position={["sticky", "static"]}
      $display={["block", "none"]}
      $top="all-spacing-0"
      $zIndex={"fixed-header"}
    >
      <OakBox
        $width={"100%"}
        $background={"white"}
        $mb="space-between-ssx"
        data-test-id="filter-mobiles"
      >
        <OakBox>
          <OakBox
            $bb={"border-solid-s"}
            $borderColor={"grey30"}
            $ph={["inner-padding-m", "inner-padding-none"]}
            $pb={"inner-padding-m"}
          >
            <Button
              label={`Filter and highlight`}
              icon="chevron-right"
              $iconPosition="trailing"
              variant="buttonStyledAsLink"
              $mt={16}
              onClick={onOpenModal}
              data-testid="mobile-highlight-thread"
            />
            {selectedThread && (
              <OakFlex>
                <Box
                  $textOverflow={"ellipsis"}
                  $whiteSpace={"nowrap"}
                  $overflow={"hidden"}
                  data-testid="highlighted-threads-mobile"
                  $maxWidth={"50%"}
                >
                  {threadDef(selectedThread)?.title}
                </Box>
                <OakBox $mh="space-between-ssx"> • </OakBox>
                <OakBox data-testid="highlighted-units-box-mobile">
                  <OakSpan aria-live="polite" aria-atomic="true">
                    {highlightedUnits} units highlighted
                  </OakSpan>
                </OakBox>
              </OakFlex>
            )}
          </OakBox>
          <OakBox
            $bb={"border-solid-s"}
            $borderColor={"grey30"}
            $width={"100%"}
            data-testid={"year-selection-mobile"}
          >
            <ScrollableWrapper>
              <StyledButtonGroup aria-label="Select a year group">
                {yearOptions.map((yearOption) => {
                  const isYearSelected = lockYear
                    ? lockYear === yearOption
                    : isSelectedYear(yearOption);
                  return (
                    <OakBox
                      key={yearOption}
                      $pt="inner-padding-xs"
                      $ml="space-between-sssx"
                    >
                      <FocusIndicator
                        data-testid="year-group-focus-indicator"
                        $display={"inline-block"}
                        $mb="space-between-ssx"
                        $mr="space-between-ssx"
                        $background={isYearSelected ? "black" : "white"}
                        $color={isYearSelected ? "white" : "black"}
                        $borderRadius={"border-radius-s"}
                        $font="heading-7"
                        disableMouseHover={isSelectedYear(yearOption)}
                      >
                        <StyledButton
                          data-testid="year-group-filter-button"
                          aria-pressed={isSelectedYear(yearOption)}
                          onClick={() => {
                            onSelectYear(yearOption);
                            trackSelectYear(yearOption);
                            scrollToYearSection(yearOption);
                          }}
                        >
                          {getYearGroupTitle(yearData, yearOption)}
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
