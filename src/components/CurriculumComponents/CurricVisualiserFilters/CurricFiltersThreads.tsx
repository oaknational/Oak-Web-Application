import { OakSpan, OakBox } from "@oaknational/oak-components";
import { useId } from "react";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";

import { Thread, CurriculumFilters } from "@/utils/curriculum/types";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { joinWords, pluralizeUnits } from "@/utils/curriculum/formatting";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type CurricFiltersThreadsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source?: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersThreads({
  filters,
  onChangeFilters,
  data,
}: Readonly<CurricFiltersThreadsProps>) {
  const id = useId();
  const { yearData, threadOptions } = data;

  function isSelectedThread(thread: Thread) {
    return filters.threads.includes(thread.slug);
  }

  return (
    <OakBox>
      <Fieldset data-testid={"threads-filter-desktop"}>
        <FieldsetLegend
          $font={["heading-7", "heading-6"]}
          $mt="spacing-32"
          $mb={["spacing-4", "spacing-0"]}
        >
          Highlight a thread
        </FieldsetLegend>
        <RadioGroup
          name={"thread" + id}
          onChange={(e) => {
            const threads = e.target.value === "" ? [] : [e.target.value];
            onChangeFilters({ ...filters, threads });
          }}
          value={filters.threads[0] ?? ""}
        >
          <OakBox
            $mv="spacing-16"
            $pl="spacing-12"
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
            const highlightedCount = !isSelected
              ? 0
              : highlightedUnitCount(yearData, filters, filters.threads);

            return (
              <OakBox
                $ba="border-solid-s"
                $background={isSelected ? "black" : "white"}
                $borderColor={isSelected ? "black" : "grey40"}
                $borderRadius="border-radius-s"
                $color={isSelected ? "white" : "black"}
                $font={isSelected ? "heading-light-7" : "body-2"}
                $ph="spacing-12"
                $pt="spacing-12"
                $mb="spacing-8"
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
                    {isSelected && (
                      <>
                        <br />
                        {joinWords([
                          highlightedCount,
                          pluralizeUnits(highlightedCount),
                          "highlighted",
                        ])}
                      </>
                    )}
                  </OakSpan>
                </RadioButton>
              </OakBox>
            );
          })}
        </RadioGroup>
      </Fieldset>
    </OakBox>
  );
}
