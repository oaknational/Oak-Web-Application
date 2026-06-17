import {
  ProgrammeFiltersExamBoard,
  shouldDisplayExamBoardFilter,
} from "./ProgrammeFiltersExamBoard";
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
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export const getDisplayedFilters = (
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
  slugs: CurriculumSelectionSlugs,
  ks4Options: Ks4Option[],
) => {
  return [
    {
      key: "years",
      component: CurricFiltersYears,
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "years"),
    },
    {
      key: "examBoard",
      component: ProgrammeFiltersExamBoard,
      shouldDisplayFilter: shouldDisplayExamBoardFilter(
        slugs,
        filters,
        ks4Options,
      ),
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
  examboardFilterDimensions,
}: Readonly<ProgrammePageFiltersProps>) {
  return (
    <>
      {getDisplayedFilters(data, filters, slugs, ks4Options).map(
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
              examboardFilterDimensions={examboardFilterDimensions}
              context="integrated-journey"
            />
          );
        },
      )}
    </>
  );
}
