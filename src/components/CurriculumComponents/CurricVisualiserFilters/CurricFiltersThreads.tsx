import { OakSpan, OakBox } from "@oaknational/oak-components";
import { useId } from "react";

import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";

import { Thread, CurriculumFilters } from "@/utils/curriculum/types";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurricFiltersThreadsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersThreads({
  filters,
  onChangeFilters,
  data,
}: CurricFiltersThreadsProps) {
  const id = useId();
  const { yearData, threadOptions } = data;

  function isSelectedThread(thread: Thread) {
    return filters.threads.includes(thread.slug);
  }

  return (
    <OakBox>
      <Fieldset data-testid={"threads-filter-desktop"}>
        <FieldsetLegend
          $font={"heading-7"}
          $mt="space-between-m2"
          $mb="space-between-sssx"
        >
          Highlight a thread
        </FieldsetLegend>
        <RadioGroup
          name={"thread" + id}
          onChange={(e) =>
            onChangeFilters({ ...filters, threads: [e.target.value] })
          }
          value={filters.threads[0] ?? ""}
        >
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
              filters,
              filters.threads,
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
                    {isSelected && (
                      <>
                        <br />
                        {highlightedCount}
                        {highlightedCount === 1 ? " unit " : " units "}
                        highlighted
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
