import React, { FC, useState, useRef, useEffect } from "react";
import { OakP, OakHeading, OakFlex } from "@oaknational/oak-components";

import { Thread } from "../CurriculumVisualiser/CurriculumVisualiser";

import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button/Button";
import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
import Radio from "@/components/SharedComponents/RadioButtons/Radio";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";

// Types and interfaces

type UnitsTabMobileProps = {
  selectedThread: Thread | null;
  handleSelectThread: (thread: string) => void;
  threadOptions: Thread[];
  isSelectedThread: (thread: Thread) => boolean;
  highlightedUnitCount: () => number;
  trackSelectYear: (year: string) => void;
  yearOptions: string[];
  updateMobileHeaderScroll: (height: number) => void;
};

// Function component

const UnitsTabMobile: FC<UnitsTabMobileProps> = ({
  updateMobileHeaderScroll,
  selectedThread,
  handleSelectThread,
  threadOptions,
  isSelectedThread,
  highlightedUnitCount,
  trackSelectYear,
  yearOptions,
}) => {
  // Initialize constants
  const [mobileThreadModalOpen, setMobileThreadModalOpen] =
    useState<boolean>(false);
  const [mobileYearSelection, setMobileYearSelection] = useState<string | null>(
    "7",
  );

  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  // Add padding offset for mobile year group filter scroll
  useEffect(() => {
    if (mobileHeaderRef.current) {
      const boundingRect = mobileHeaderRef.current.getBoundingClientRect();
      updateMobileHeaderScroll(boundingRect.height);
    }
  });

  function handleMobileThreadModal(): void {
    setMobileThreadModalOpen(!mobileThreadModalOpen);
  }

  return mobileThreadModalOpen ? (
    <Box
      $background={"white"}
      $position="fixed"
      $top={0}
      $right={0}
      $height={"100%"}
      $width={"100%"}
      $zIndex={"modalDialog"}
    >
      <Box $position={"fixed"} $top={20} $right={16}>
        <Button
          label=""
          aria-label="Close Menu"
          icon={"cross"}
          variant={"minimal"}
          size={"large"}
          onClick={handleMobileThreadModal}
          aria-expanded={open}
        />
      </Box>
      <Box
        $ml={16}
        $mt={32}
        $display={["block", "none"]}
        data-testid="mobile-thread-modal"
      >
        <OakHeading tag={"h4"} $font={"heading-7"} $mb="space-between-m">
          Highlight a thread
        </OakHeading>
        <OakP $mb="space-between-m">
          Threads are groups of units across the curriculum that build a common
          body of knowledge
        </OakP>
        <RadioGroup
          aria-label="Highlight a thread"
          value={selectedThread ? selectedThread.slug : ""}
          onChange={handleSelectThread}
        >
          <Box>
            <Box $mv={16}>
              <Radio
                aria-label={"None highlighted"}
                value={""}
                data-testid={"no-threads-radio-mobile"}
              >
                None highlighted
              </Radio>
            </Box>
            {threadOptions.map((threadOption) => {
              const isSelectedMobile = isSelectedThread(threadOption);
              const highlightedUnits = highlightedUnitCount();
              return (
                <Box
                  $ba={1}
                  $background={isSelectedMobile ? "black" : "white"}
                  $borderColor={isSelectedMobile ? "black" : "grey40"}
                  $borderRadius={4}
                  $color={isSelectedMobile ? "white" : "black"}
                  $font={isSelectedMobile ? "heading-light-7" : "body-2"}
                  $ph={12}
                  $pt={12}
                  $mb={8}
                  key={threadOption.slug}
                >
                  <Radio
                    aria-label={threadOption.title}
                    value={threadOption.slug}
                    data-testid={
                      isSelectedMobile
                        ? "selected-thread-radio-mobile"
                        : "thread-radio-mobile"
                    }
                  >
                    {threadOption.title}
                    {isSelectedMobile && (
                      <>
                        <br />
                        {highlightedUnits}
                        {highlightedUnits === 1 ? " unit " : " units "}
                        highlighted
                      </>
                    )}
                  </Radio>
                </Box>
              );
            })}
          </Box>
        </RadioGroup>
      </Box>

      <OakFlex
        $position={"fixed"}
        $width={"100%"}
        $background={"white"}
        $bottom={["all-spacing-0"]}
        $right={["all-spacing-0"]}
        $justifyContent={"center"}
      >
        <Button
          $ma={16}
          label="Done"
          data-testid="mobile-done-thread-modal-button"
          icon="arrow-right"
          $iconPosition="trailing"
          iconBackground="black"
          onClick={handleMobileThreadModal}
        />
      </OakFlex>
    </Box>
  ) : (
    <Box $display={["unset", "none"]}>
      <Box
        $position={["sticky", "static"]}
        $top={0}
        $zIndex={"inFront"}
        ref={mobileHeaderRef}
      >
        <Box
          $width={"100%"}
          $background={"white"}
          $mb={8}
          data-test-id="filter-mobiles"
        >
          <Box>
            <Box $dropShadow="mobileFilterSelector" $ph={[16, 0]} $pb={16}>
              <Button
                label="Highlight a thread"
                icon="chevron-right"
                $iconPosition="trailing"
                variant="buttonStyledAsLink"
                $mt={16}
                onClick={handleMobileThreadModal}
                data-testid="mobile-highlight-thread"
              />
              {selectedThread && (
                <Box
                  $textOverflow={"ellipsis"}
                  $whiteSpace={"nowrap"}
                  $overflow={"hidden"}
                  data-testid="highlighted-threads-mobile"
                >
                  {selectedThread?.title} • {highlightedUnitCount()} units
                  highlighted
                </Box>
              )}
            </Box>
            <Box
              $pt={10}
              $dropShadow="mobileFilterSelector"
              $width={"100%"}
              $ph={[16, 0]}
              data-testid={"year-selection-mobile"}
            >
              <ButtonGroup
                aria-label="Select a year group"
                $overflowX={"auto"}
                $overflowY={"hidden"}
                $pb={8}
              >
                {yearOptions.map((yearOption) => (
                  <Box key={yearOption} $pt={8} $ml={5}>
                    <Button
                      variant="brush"
                      aria-label={`Year ${yearOption}`}
                      background={
                        mobileYearSelection === yearOption ? "black" : "grey20"
                      }
                      key={yearOption}
                      label={`Year ${yearOption}`}
                      onClick={() => {
                        setMobileYearSelection(yearOption);
                        // Scroll into view used also in Lesson Overview - prevents rerender
                        document
                          .getElementById(`year-${yearOption}`)
                          ?.scrollIntoView();
                        trackSelectYear(yearOption);
                      }}
                      data-testid="year-group-filter-button"
                    />
                  </Box>
                ))}
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default UnitsTabMobile;
