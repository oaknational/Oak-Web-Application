import {
  OakBox,
  OakRadioGroup,
  OakRadioAsButton,
} from "@oaknational/oak-components";
import { useId } from "react";

import { Thread } from "@/utils/curriculum/types";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { pluralizeUnits } from "@/utils/curriculum/formatting";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type ProgrammeFiltersThreadsProps = {
  data: CurriculumUnitsFormattedData;
};

export function ProgrammeFiltersThreads({
  data,
}: Readonly<ProgrammeFiltersThreadsProps>) {
  const id = useId();
  const { filters, setThreadFilter } = useBrowseFilters();
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
  const radioWidth = "100%";
  return (
    <OakRadioGroup
      name={`threads-${id}`}
      onChange={(e) => setThreadFilter(e.target.value.trim())}
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
