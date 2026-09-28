import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakTertiaryButton,
  OakP,
} from "@oaknational/oak-components";
import { useId } from "react";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import type { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getKeystageSlug } from "@/fixtures/curriculum/unit";
import { useBrowseFilters } from "@/context/BrowseFilters";

export type BrowseFiltersYearsProps = {
  data: CurriculumUnitsFormattedData;
  onModalOpen?: () => void;
};

type YearOption = { year: string };

export const getColorSchemeByYear = (year: string) => {
  switch (year) {
    case "1":
    case "7":
      return "decorative3";
    case "3":
    case "9":
      return "decorative2";
    case "4":
    case "10":
      return "decorative4";
    case "5":
    case "11":
      return "decorative5";
    case "6":
      return "decorative6";
    default:
      // year 2, 8 and 'all years'
      return "decorative1";
  }
};

export function BrowseFiltersYears(props: Readonly<BrowseFiltersYearsProps>) {
  const { data, onModalOpen } = props;
  const { filters, setYearFilter } = useBrowseFilters();
  const id = useId();
  const { yearData } = data;

  const ksFilter = filters.keystages[0];
  const yearOptions = data.yearOptions
    .filter((year) => {
      const ksForYear = getKeystageSlug(year);

      if (ksFilter) {
        return ksForYear === ksFilter;
      } else {
        return true;
      }
    })
    .map<YearOption>((year) => ({ year }));

  return (
    <OakBox>
      <OakRadioGroup
        name={"year" + id}
        onChange={(e) => setYearFilter(e.target.value, data.yearOptions)}
        value={filters.years.length > 1 ? "all" : filters.years[0]}
        $gap="spacing-12"
        $flexDirection="row"
        $flexWrap="wrap"
        data-testid="year-group-filter-desktop"
        $alignItems="center"
      >
        <OakP $font="heading-7" $mb="spacing-16" as="legend">
          Year group
        </OakP>
        <OakRadioAsButton
          value={"all"}
          displayValue="All"
          data-testid={"all-years-radio"}
        />
        {yearOptions.map((yearOption) => (
          <OakRadioAsButton
            key={yearOption.year}
            value={yearOption.year}
            displayValue={getYearGroupTitle(yearData, yearOption.year)}
            data-testid={"year-radio"}
            colorScheme={getColorSchemeByYear(yearOption.year)}
          />
        ))}
        {/* Tablet view only */}
        {onModalOpen && (
          <OakBox $display={["none", "block", "none"]}>
            <OakTertiaryButton
              isTrailingIcon
              iconName="filter"
              onClick={onModalOpen}
              data-testid="tablet-all-filters"
            >
              All filters
            </OakTertiaryButton>
          </OakBox>
        )}
      </OakRadioGroup>
    </OakBox>
  );
}
