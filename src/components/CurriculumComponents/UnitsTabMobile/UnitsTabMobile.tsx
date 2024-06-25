import React, { FC, useState, useRef, useEffect } from "react";
import { OakP, OakFlex, OakSpan } from "@oaknational/oak-components";

import { Thread } from "../CurriculumVisualiser/CurriculumVisualiser";
import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioButton, RadioGroup } from "../OakComponentsKitchen/SimpleRadio";

import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button/Button";
import ButtonGroup from "@/components/SharedComponents/ButtonGroup";

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
  visibleMobileYearRefID: string | null;
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
  visibleMobileYearRefID,
}) => {
  // Initialize constants
  const defaultMobileYearSelection = "7";

  const [mobileThreadModalOpen, setMobileThreadModalOpen] =
    useState<boolean>(false);
  const [mobileYearSelection, setMobileYearSelection] = useState<string | null>(
    defaultMobileYearSelection,
  );

  useEffect(() => {
    if (visibleMobileYearRefID !== mobileYearSelection) {
      setMobileYearSelection(visibleMobileYearRefID);
    }
  }, [visibleMobileYearRefID, mobileYearSelection]);

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
      $height={"100%"}
      $zIndex={"modalDialog"}
      $display={["block", "none"]}
    >
      <Box $position={"absolute"} $top={20} $right={16} $zIndex={"inFront"}>
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
      <Fieldset
        $ml={16}
        $mt={32}
        $mr={16}
        data-testid="mobile-thread-modal"
        $height={"85%"}
        $overflow={"scroll"}
      >
        <FieldsetLegend $font={"heading-7"} $mb="space-between-m">
          Highlight a thread
        </FieldsetLegend>
        <OakP $mb="space-between-m">
          Threads are groups of units across the curriculum that build a common
          body of knowledge
        </OakP>
        <RadioGroup
          name="thread"
          value={selectedThread ? selectedThread.slug : ""}
          onChange={(e) => handleSelectThread(e.target.value)}
        >
          <Box>
            <Box $mv={16} $position={"relative"}>
              <RadioButton
                aria-label={"None highlighted"}
                value={""}
                data-testid={"no-threads-radio-mobile"}
              >
                None highlighted
              </RadioButton>
            </Box>
            {threadOptions.map((threadOption) => {
              const isSelectedMobile = isSelectedThread(threadOption);
              const highlightedUnits = highlightedUnitCount();
              return (
                <Box
                  $position={"relative"}
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
                  <RadioButton
                    aria-label={threadOption.title}
                    value={threadOption.slug}
                    data-testid={
                      isSelectedMobile
                        ? "selected-thread-radio-mobile"
                        : "thread-radio-mobile"
                    }
                  >
                    <OakSpan>
                      {threadOption.title}
                      <OakSpan aria-live="polite" aria-atomic="true">
                        {isSelectedMobile && (
                          <>
                            <br />
                            {highlightedUnits}
                            {highlightedUnits === 1 ? " unit " : " units "}
                            highlighted
                          </>
                        )}
                      </OakSpan>
                    </OakSpan>
                  </RadioButton>
                </Box>
              );
            })}
          </Box>
        </RadioGroup>
      </Fieldset>
      <OakFlex
        $position={"fixed"}
        $width={"100%"}
        $background={"white"}
        $bottom={["all-spacing-0"]}
        $right={["all-spacing-0"]}
        $justifyContent={"left"}
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
                <OakFlex>
                  <Box
                    $textOverflow={"ellipsis"}
                    $whiteSpace={"nowrap"}
                    $overflow={"hidden"}
                    data-testid="highlighted-threads-mobile"
                    $maxWidth={"50%"}
                  >
                    {selectedThread?.title}
                  </Box>
                  <Box $mh={6}> • </Box>
                  <Box data-testid="highlighted-units-box-mobile">
                    <OakSpan aria-live="polite" aria-atomic="true">
                      {highlightedUnitCount()} units highlighted
                    </OakSpan>
                  </Box>
                </OakFlex>
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
                      isCurrent={yearOption === mobileYearSelection}
                      key={yearOption}
                      label={`Year ${yearOption}`}
                      onClick={() => {
                        // Scroll into view used also in Lesson Overview - prevents rerender
                        document
                          .getElementById(`year-${yearOption}`)
                          ?.scrollIntoView({ behavior: "smooth" });
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
