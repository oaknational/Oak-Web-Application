import { ProgrammeFiltersThreads } from "./ProgrammeFiltersThreads";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  CurricFiltersYears,
  CurricFiltersSubjectCategories,
  CurricFiltersChildSubjects,
  CurricFiltersTiers,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import { shouldDisplayFilter } from "@/utils/curriculum/filteringApp";
import { CurriculumFilters } from "@/utils/curriculum/types";

export const getDisplayedFilters = (
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
) => {
  return [
    {
      key: "years",
      component: CurricFiltersYears,
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "years"),
    },
    {
      key: "subjectCategories",
      component: CurricFiltersSubjectCategories,
      shouldDisplayFilter: shouldDisplayFilter(
        data,
        filters,
        "subjectCategories",
      ),
    },
    {
      key: "childSubjects",
      component: CurricFiltersChildSubjects,
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "childSubjects"),
    },
    {
      key: "tiers",
      component: CurricFiltersTiers,
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "tiers"),
    },
    {
      key: "threads",
      component: ProgrammeFiltersThreads,
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "threads"),
    },
  ] as const;
};

export function ProgrammeFilters({
  filters,
  onChangeFilters,
  data,
  slugs,
  ks4Options,
}: Readonly<ProgrammePageFiltersProps>) {
  return (
    <>
      {getDisplayedFilters(data, filters).map(
        ({ key, component: FilterComponent, shouldDisplayFilter }) => {
          if (!shouldDisplayFilter) {
            return null;
          }
          return (
            <FilterComponent
              key={key}
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={data}
              slugs={slugs}
              ks4Options={ks4Options}
              context="integrated-journey"
            />
          );
        },
      )}
    </>
  );
}
