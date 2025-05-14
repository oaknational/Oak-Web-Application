import {
  OakHeading,
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
} from "@oaknational/oak-components";
import { isEqual } from "lodash";
import { useId } from "react";

import {
  getPathwaySuffix,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import { CurriculumFilters } from "@/utils/curriculum/types";
import type { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { keystageFromYear } from "@/utils/curriculum/keystage";

export type CurricFiltersYearsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
  slugs: CurriculumSelectionSlugs;
};

type YearOption = { year: string; pathway?: string };

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
            yearOption.pathway === currentPathway
          );
        } else {
          return yearOption.year === currentYear;
        }
      });
  }
  return index;
};

export function CurricFiltersYears({
  filters,
  onChangeFilters,
  data,
  ks4Options,
  slugs,
}: CurricFiltersYearsProps) {
  const id = useId();
  const { yearData } = data;

  const shouldDisplayCorePathway =
    slugs.ks4OptionSlug !== "core" && getShouldDisplayCorePathway(ks4Options);
  const yearOptions = data.yearOptions.map<YearOption>((year) => {
    if (shouldDisplayCorePathway) {
      return {
        year,
        pathway: keystageFromYear(year) === "ks4" ? "core" : undefined,
      };
    } else {
      return { year };
    }
  });
  function addAllToFilter(target: { year: string; pathway?: string }) {
    if (target.year === "all") {
      onChangeFilters({ ...filters, years: data.yearOptions, pathways: [] });
    } else {
      onChangeFilters({
        ...filters,
        years: [target.year],
        pathways: target.pathway ? [target.pathway] : [],
      });
    }
  }

  if (shouldDisplayCorePathway) {
    if (data.yearOptions.includes("10")) {
      yearOptions.push({ year: "10", pathway: "non_core" });
    }
    if (data.yearOptions.includes("11")) {
      yearOptions.push({ year: "11", pathway: "non_core" });
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
      <OakHeading
        tag="h4"
        id="year-group-label"
        $font={"heading-6"}
        $mb="space-between-s"
      >
        Year group
      </OakHeading>

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
        $gap="space-between-ssx"
        $flexDirection="row"
        $flexWrap="wrap"
        aria-labelledby="year-group-label"
        data-testid="year-group-filter-desktop"
      >
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
