import { OakBox, OakP, OakSpan } from "@oaknational/oak-components";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";
import SkipLink from "../OakComponentsKitchen/SkipLink";

import { CurriculumVisualiserFiltersProps } from "./CurriculumVisualiserFilters";
import { highlightedUnitCount } from "./helpers";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
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
          value={selectedThread ?? ""}
        >
          <SkipLink href="#content">Skip to units</SkipLink>
          <OakBox
            $mv="space-between-s"
            $pl="inner-padding-s"
            $bl="border-solid-s"
            $borderColor="transparent"
          >
            <RadioButton
              aria-label={"None highlighted"}
              value={""}
              data-testid={"no-threads-radio"}
            >
              None highlighted
            </RadioButton>
          </OakBox>
          {threadOptions.map((threadOption) => {
            const isSelected = isSelectedThread(threadOption);
            const highlightedCount = highlightedUnitCount(
              yearData,
              selectedYear,
              yearSelection,
              selectedThread,
            );

            return (
              <OakBox
                $ba="border-solid-s"
                $background={isSelected ? "black" : "white"}
                $borderColor={isSelected ? "black" : "grey40"}
                $borderRadius="border-radius-s"
                $color={isSelected ? "white" : "black"}
                $font={isSelected ? "heading-light-7" : "body-2"}
                $ph="inner-padding-s"
                $pt="inner-padding-s"
                $mb="space-between-ssx"
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
                    <OakSpan>
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
              </OakBox>
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
          <OakBox $mb="space-between-s">
            <RadioButton
              aria-label="All year groups"
              value={""}
              data-testid={"all-years-radio"}
            >
              All
            </RadioButton>
          </OakBox>
          {yearOptions.map((yearOption) => (
            <OakBox key={yearOption} $mb="space-between-s">
              <RadioButton
                value={yearOption}
                data-testid={"year-radio"}
                aria-label={getYearGroupTitle(yearData, yearOption)}
              >
                {getYearGroupTitle(yearData, yearOption)}
              </RadioButton>
            </OakBox>
          ))}
        </RadioGroup>
      </Fieldset>
    </>
  );
}
