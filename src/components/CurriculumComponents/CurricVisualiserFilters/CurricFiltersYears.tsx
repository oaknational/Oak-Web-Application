import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakP,
} from "@oaknational/oak-components";
import { isEqual } from "lodash";
import { useId } from "react";

import {
  getPathwaySuffix,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import {
  CurriculumFilters,
  OnChangeCurriculumFilters,
} from "@/utils/curriculum/types";
import type { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { keystageFromYear } from "@/utils/curriculum/keystage";
import { FilterType } from "@/browser-lib/avo/Avo";
import { getKeystageSlug } from "@/fixtures/curriculum/unit";

export type CurricFiltersYearsProps = {
  filters: CurriculumFilters;
  onChangeFilters: OnChangeCurriculumFilters;
  data: CurriculumUnitsFormattedData;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
  slugs: CurriculumSelectionSlugs;
};

type YearOption = { year: string; pathway?: string; queryString?: string };

const filterToIndex = (
  filters: CurriculumFilters,
  yearOptions: YearOption[],
  allYears: string[],
  shouldDisplayCorePathway: boolean,
) => {
  let index = 0;
  if (isEqual(filters.years, allYears)) {
    index = 0;
  } else {
    const currentYear = filters.years[0]!;
    const currentPathway = filters.pathways[0]!;
    index =
      1 +
      yearOptions.findIndex((yearOption) => {
        if (shouldDisplayCorePathway) {
          return (
            yearOption.year === currentYear &&
            yearOption.queryString === currentPathway
          );
        } else {
          return yearOption.year === currentYear;
        }
      });
  }
  return index;
};

export function CurricFiltersYears(props: Readonly<CurricFiltersYearsProps>) {
  const { filters, onChangeFilters, data, ks4Options, slugs } = props;
  const id = useId();
  const { yearData } = data;

  const shouldDisplayCorePathway =
    slugs.ks4OptionSlug !== "core" && getShouldDisplayCorePathway(ks4Options);

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
    .map<YearOption>((year) => {
      if (shouldDisplayCorePathway) {
        return {
          year,
          pathway: keystageFromYear(year) === "ks4" ? "core" : undefined,
          queryString: "core",
        };
      } else {
        return { year };
      }
    });

  function addAllToFilter(target: YearOption) {
    if (target.year === "all") {
      onChangeFilters({
        newFilters: { ...filters, years: data.yearOptions, pathways: [] },
        filterType: FilterType.YEAR_FILTER,
        filterValue: "all",
      });
    } else {
      onChangeFilters({
        newFilters: {
          ...filters,
          years: [target.year],
          pathways: target.queryString ? [target.queryString] : [],
        },
        filterType: FilterType.YEAR_FILTER,
        filterValue: target.year,
      });
    }
  }

  if (shouldDisplayCorePathway) {
    if (data.yearOptions.includes("10")) {
      yearOptions.push({
        year: "10",
        queryString: "non_core",
        pathway: "non_core",
      });
    }
    if (data.yearOptions.includes("11")) {
      yearOptions.push({
        year: "11",
        queryString: "non_core",
        pathway: "non_core",
      });
    }
  }

  const index = filterToIndex(
    filters,
    yearOptions,
    data.yearOptions,
    shouldDisplayCorePathway,
  );

  return (
    <OakBox>
      <OakRadioGroup
        name={"year" + id}
        onChange={(e) =>
          addAllToFilter(
            e.target.value === "0"
              ? { year: "all" }
              : yearOptions[Number(e.target.value) - 1]!,
          )
        }
        value={String(index)}
        $gap="spacing-8"
        $flexDirection="row"
        $flexWrap="wrap"
        data-testid="year-group-filter-desktop"
        $alignItems="center"
      >
        <OakP $font="heading-6" $mb="spacing-16" as="legend">
          Year group
        </OakP>
        <OakRadioAsButton
          value={"0"}
          displayValue="All"
          data-testid={"all-years-radio"}
        />
        {yearOptions.map((yearOption, index) => {
          const pathwaySuffix = shouldDisplayCorePathway
            ? getPathwaySuffix(yearOption.year, yearOption.pathway)
            : undefined;
          const pathwaySuffixStr = pathwaySuffix
            ? `(${pathwaySuffix})`
            : undefined;

          return (
            <OakRadioAsButton
              key={`${yearOption.year}-${yearOption.pathway}`}
              value={String(index + 1)}
              displayValue={getYearGroupTitle(
                yearData,
                yearOption.year,
                pathwaySuffixStr,
              )}
              data-testid={"year-radio"}
            />
          );
        })}
      </OakRadioGroup>
    </OakBox>
  );
}
