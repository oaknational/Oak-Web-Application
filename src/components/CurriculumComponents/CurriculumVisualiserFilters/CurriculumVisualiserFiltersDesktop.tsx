import { OakP, OakSpan } from "@oaknational/oak-components";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import { CurriculumVisualiserFiltersProps } from "./CurriculumVisualiserFilters";
import { highlightedUnitCount } from "./helpers";

import Box from "@/components/SharedComponents/Box";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { getNumberOfSelectedUnits } from "@/utils/curriculum/getNumberOfSelectedUnits";
import { Thread } from "@/utils/curriculum/types";

export default function CurriculumVisualiserFiltersDesktop({
  selectedThread,
  onSelectThread,
  selectedYear,
  onSelectYear,
  yearSelection,
  data,
}: CurriculumVisualiserFiltersProps) {
  const { yearData, threadOptions, yearOptions } = data;

  function isSelectedThread(thread: Thread) {
    return selectedThread === thread.slug;
  }

  const unitCount = getNumberOfSelectedUnits(
    yearData,
    selectedYear,
    yearSelection,
  );

  return (
    <>
      <Fieldset
        $mr={16}
        $mb={32}
        $display={["none", "block"]}
        data-testid="threads-filter-desktop"
      >
        <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
          Highlight a thread
        </FieldsetLegend>
        <OakP $mb="space-between-xs">
          Threads are groups of units across the curriculum that build a common
          body of knowledge
        </OakP>
        <RadioGroup
          name="thread"
          onChange={(e) => onSelectThread(e.target.value)}
          value={selectedThread}
        >
          <SkipLink href="#content">Skip to units</SkipLink>
          <Box $mv={16} $pl={12} $bl={1} $borderColor="transparent">
            <RadioButton
              aria-label={"None highlighted"}
              value={""}
              data-testid={"no-threads-radio"}
            >
              None highlighted
            </RadioButton>
          </Box>
          {threadOptions.map((threadOption) => {
            const isSelected = isSelectedThread(threadOption);
            const highlightedCount = highlightedUnitCount(
              yearData,
              selectedYear,
              yearSelection,
              selectedThread,
            );

            return (
              <Box
                $ba={1}
                $background={isSelected ? "black" : "white"}
                $borderColor={isSelected ? "black" : "grey40"}
                $borderRadius={4}
                $color={isSelected ? "white" : "black"}
                $font={isSelected ? "heading-light-7" : "body-2"}
                $ph={12}
                $pt={12}
                $mb={8}
                key={threadOption.slug}
              >
                <RadioButton
                  aria-label={threadOption.title}
                  value={threadOption.slug}
                  data-testid={
                    isSelected ? "selected-thread-radio" : "thread-radio"
                  }
                >
                  <OakSpan>
                    {threadOption.title}
                    <OakSpan aria-live="polite" aria-atomic="true">
                      {isSelected && (
                        <>
                          <br />
                          {highlightedCount}
                          {highlightedCount === 1 ? " unit " : " units "}
                          highlighted
                        </>
                      )}
                    </OakSpan>
                  </OakSpan>
                </RadioButton>
              </Box>
            );
          })}
        </RadioGroup>
      </Fieldset>
      <Fieldset
        $mr={16}
        $mb={32}
        $display={["none", "block"]}
        data-testid="year-group-filter-desktop"
      >
        <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
          Year group
        </FieldsetLegend>
        <RadioGroup
          name="year"
          value={selectedYear}
          onChange={(e) => onSelectYear(e.target.value)}
        >
          <Box $mb={16}>
            <RadioButton
              aria-label="All year groups"
              value={""}
              data-testid={"all-years-radio"}
            >
              All
            </RadioButton>
          </Box>
          {yearOptions.map((yearOption) => (
            <Box key={yearOption} $mb={16}>
              <RadioButton
                value={yearOption}
                data-testid={"year-radio"}
                aria-label={getYearGroupTitle(yearData, yearOption)}
              >
                {getYearGroupTitle(yearData, yearOption)}
              </RadioButton>
            </Box>
          ))}
        </RadioGroup>
        <ScreenReaderOnly aria-live="polite" aria-atomic="true">
          Showing {unitCount} {unitCount === 1 ? "unit" : "units"}
        </ScreenReaderOnly>
      </Fieldset>
    </>
  );
}
