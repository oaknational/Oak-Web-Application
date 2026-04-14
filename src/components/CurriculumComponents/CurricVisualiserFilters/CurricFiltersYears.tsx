import {
  OakRadioGroup,
  OakRadioAsButton,
  OakBox,
  OakTertiaryButton,
  OakP,
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
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { getKeystageSlug } from "@/fixtures/curriculum/unit";

export type CurricFiltersYearsProps = {
  filters: CurriculumFilters;
  onChangeFilters: (
    newFilters: CurriculumFilters,
    source: ComponentTypeValueType,
  ) => void;
  data: CurriculumUnitsFormattedData;
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
  slugs: CurriculumSelectionSlugs;
} & (
  | {
      // The context prop can be removed once the integrated journey is fully launched
      context: "integrated-journey";
      onModalOpen?: () => void;
    }
  | { context: "curriculum-visualiser" }
);

type YearOption = { year: string; pathway?: string; queryString?: string };

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
  const { filters, onChangeFilters, data, ks4Options, slugs, context } = props;
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
      onChangeFilters(
        { ...filters, years: data.yearOptions, pathways: [] },
        "year_group_button",
      );
    } else {
      onChangeFilters(
        {
          ...filters,
          years: [target.year],
          pathways: target.queryString ? [target.queryString] : [],
        },
        "year_group_button",
      );
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
        $gap={context === "curriculum-visualiser" ? "spacing-8" : "spacing-12"}
        $flexDirection="row"
        $flexWrap="wrap"
        data-testid="year-group-filter-desktop"
        $alignItems="center"
      >
        <OakP
          $font={
            context === "curriculum-visualiser" ? "heading-6" : "heading-7"
          }
          $mb="spacing-16"
          as="legend"
        >
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
              colorScheme={
                context === "integrated-journey"
                  ? getColorSchemeByYear(yearOption.year)
                  : undefined
              }
            />
          );
        })}
        {/* Tablet view, integrated journey only */}
        {context === "integrated-journey" && props.onModalOpen && (
          <OakBox $display={["none", "block", "none"]}>
            <OakTertiaryButton
              isTrailingIcon
              iconName="filter"
              onClick={props.onModalOpen}
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
