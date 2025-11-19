import {
  OakFlex,
  OakHeading,
  OakSearchFilterCheckBox,
  OakFieldset,
} from "@oaknational/oak-components";
import React, { FC } from "react";

import { YearGroup } from "@/node-lib/curriculum-api-2023/queries/unitListing/helpers/getAllYearGroups";

type YearGroupFiltersProps = {
  yearGroups: YearGroup[];
  idSuffix: "desktop" | "mobile";
  setYear: (year: string | null) => void;
  yearGroupSlug: string;
};

const YearGroupFilters: FC<YearGroupFiltersProps> = ({
  yearGroups,
  idSuffix,
  setYear,
  yearGroupSlug,
}) => {
  return (
    <OakFlex
      $mv="spacing-32"
      $flexDirection={"column"}
      $pb={[undefined, "spacing-32"]}
      $bb={["border-solid-none", "border-solid-s"]}
      $borderColor={["transparent", "border-neutral-lighter"]}
      $flexGrow={1}
    >
      <OakFieldset>
        <OakHeading
          as={"legend"}
          tag="h3"
          $font={"heading-7"}
          $mb={"spacing-24"}
        >
          Year
        </OakHeading>
        <OakFlex
          $alignItems="flex-start"
          $flexWrap={"wrap"}
          $gap={"spacing-8"}
          $flexGrow={1}
        >
          <OakSearchFilterCheckBox
            value={`${idSuffix}-all-year-groups`}
            displayValue="All"
            id={`all-year-groups-${idSuffix}`}
            checked={!yearGroupSlug}
            onChange={() => setYear?.(null)}
          />
          {yearGroups
            .filter((yearGroup) => yearGroup.yearSlug !== "all-years")
            .map((yearGroup) => (
              <OakSearchFilterCheckBox
                id={`${yearGroup.yearTitle}-${idSuffix}`}
                value={`${idSuffix}-${yearGroup.yearSlug}`}
                displayValue={yearGroup.yearTitle}
                key={yearGroup.yearSlug}
                checked={yearGroup.yearSlug === yearGroupSlug}
                onChange={() => setYear(yearGroup.yearSlug)}
              />
            ))}
        </OakFlex>
      </OakFieldset>
    </OakFlex>
  );
};

export default YearGroupFilters;
