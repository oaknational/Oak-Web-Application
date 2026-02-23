import {
  OakBox,
  OakRadioGroup,
  OakRadioAsButton,
  OakRadioAsButtonProps,
} from "@oaknational/oak-components";
import { useId } from "react";

import { Thread, CurriculumFilters } from "@/utils/curriculum/types";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { pluralizeUnits } from "@/utils/curriculum/formatting";

export type ProgrammeFiltersThreadsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source?: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData;
  radioWidth?: OakRadioAsButtonProps["width"];
};

export function ProgrammeFiltersThreads({
  filters,
  onChangeFilters,
  data,
  radioWidth,
}: Readonly<ProgrammeFiltersThreadsProps>) {
  const id = useId();
  const { yearData, threadOptions } = data;

  function getDisplayValue(threadOption: Thread) {
    const isSelected = filters.threads.includes(threadOption.slug);
    const highlightCount = highlightedUnitCount(
      yearData,
      filters,
      filters.threads,
    );
    if (isSelected) {
      return (
        <div>
          <div>{threadOption.title}</div>
          <OakBox $font="body-2">
            {`${highlightCount} ${pluralizeUnits(highlightCount)} highlighted`}
          </OakBox>
        </div>
      );
    }

    return threadOption.title;
  }

  return (
    <OakRadioGroup
      name={`threads-${id}`}
      onChange={(e) => {
        const threads = e.target.value.trim() === "" ? [] : [e.target.value];
        onChangeFilters({ ...filters, threads });
      }}
      value={filters.threads.at(0) ?? ""}
      $gap="spacing-12"
    >
      <OakBox as="legend" $font="heading-7" $mb="spacing-16">
        Highlight a thread
      </OakBox>
      <OakRadioAsButton
        variant="with-radio"
        colorScheme="transparent"
        displayValue={"None highlighted"}
        value={""}
        width={radioWidth}
      />
      {threadOptions.map((threadOption) => {
        return (
          <OakRadioAsButton
            key={threadOption.slug}
            variant="with-radio"
            colorScheme="transparent"
            value={threadOption.slug}
            displayValue={getDisplayValue(threadOption)}
            width={radioWidth}
          />
        );
      })}
    </OakRadioGroup>
  );
}
