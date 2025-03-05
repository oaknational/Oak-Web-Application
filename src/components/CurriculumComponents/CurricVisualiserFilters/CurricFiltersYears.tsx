import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
} from "@oaknational/oak-components";
import { isEqual } from "lodash";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { CurriculumFilters } from "@/utils/curriculum/types";
import type { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export type CurricFiltersYearsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
};

export function CurricFiltersYears({
  filters,
  onChangeFilters,
  data,
}: CurricFiltersYearsProps) {
  const { yearData, yearOptions } = data;

  function addAllToFilter(key: keyof CurriculumFilters, target: string[]) {
    onChangeFilters({ ...filters, [key]: target });
  }

  return (
    <>
      <OakHeading
        tag="h4"
        id="year-group-label"
        $font={"heading-6"}
        $mb="space-between-s"
      >
        Year group
      </OakHeading>

      <OakRadioGroup
        name="year"
        onChange={(e) =>
          addAllToFilter(
            "years",
            e.target.value === "all" ? yearOptions : [e.target.value],
          )
        }
        value={isEqual(filters.years, yearOptions) ? "all" : filters.years[0]!}
        $gap="space-between-ssx"
        $flexDirection="row"
        $flexWrap="wrap"
        aria-labelledby="year-group-label"
        data-testid="year-group-filter-desktop"
      >
        <OakRadioAsButton
          value="all"
          displayValue="All"
          data-testid={"all-years-radio"}
        />
        {yearOptions.map((yearOption) => (
          <OakRadioAsButton
            key={yearOption}
            value={yearOption}
            displayValue={getYearGroupTitle(yearData, yearOption)}
            data-testid={"year-radio"}
          />
        ))}
      </OakRadioGroup>
    </>
  );
}
