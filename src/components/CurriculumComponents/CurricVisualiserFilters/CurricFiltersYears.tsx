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
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export type CurricFiltersYearsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (newFilters: CurriculumFilters) => void;
  data: CurriculumUnitsFormattedData;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
  slugs: CurriculumSelectionSlugs;
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

  const hasCorePathway = !!ks4Options?.find((opt) => opt.slug === "core");
  const shouldDisplayCorePathway =
    hasCorePathway && slugs.ks4OptionSlug !== "core";
  const yearOptions = data.yearOptions.map<{ year: string; pathway?: string }>(
    (year) => {
      if (shouldDisplayCorePathway) {
        return { year, pathway: "!core" };
      } else {
        return { year };
      }
    },
  );
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
      yearOptions.push({ year: "10", pathway: "core" });
    }
    if (data.yearOptions.includes("11")) {
      yearOptions.push({ year: "11", pathway: "core" });
    }
  }

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
            e.target.value === "all"
              ? { year: "all" }
              : yearOptions[Number(e.target.value)]!,
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
              value={String(index)}
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
