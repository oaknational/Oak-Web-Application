import {
  ProgrammeFiltersKs4Options,
  shouldDisplayKs4OptionsFilter,
} from "./ProgrammeFiltersKs4Options";
import { BrowseFiltersThreads } from "./BrowseFilters/BrowseFiltersThreads";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  BrowseFiltersYears,
  BrowseFiltersSubjectCategories,
  BrowseFiltersChildSubjects,
  BrowseFiltersTiers,
} from "@/components/CurriculumComponents/CurricVisualiserFilters";
import { shouldDisplayFilter } from "@/utils/curriculum/filtering";
import { CurriculumFilters } from "@/utils/curriculum/types";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { useBrowseFilters } from "@/context/BrowseFilters";

export const getDisplayedFilters = (
  data: CurriculumUnitsFormattedData,
  filters: CurriculumFilters,
  slugs: CurriculumSelectionSlugs,
  ks4Options: Ks4Option[],
) => {
  return [
    {
      key: "years",
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "years"),
    },
    {
      key: "ks4Options",
      shouldDisplayFilter: shouldDisplayKs4OptionsFilter(
        slugs,
        filters,
        ks4Options,
      ),
    },
    {
      key: "subjectCategories",
      shouldDisplayFilter: shouldDisplayFilter(
        data,
        filters,
        "subjectCategories",
      ),
    },
    {
      key: "childSubjects",
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "childSubjects"),
    },
    {
      key: "tiers",
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "tiers"),
    },
    {
      key: "threads",
      shouldDisplayFilter: shouldDisplayFilter(data, filters, "threads"),
    },
  ] as const;
};

export type ProgrammeFiltersProps = ProgrammePageFiltersProps;

export function ProgrammeFilters({
  data,
  slugs,
  ks4Options,
  ks4OptionFilterDimensions,
}: Readonly<ProgrammeFiltersProps>) {
  const { filters } = useBrowseFilters();
  return (
    <>
      {getDisplayedFilters(data, filters, slugs, ks4Options).map(
        ({ key, shouldDisplayFilter }) => {
          if (!shouldDisplayFilter) {
            return null;
          }

          switch (key) {
            case "ks4Options":
              return (
                <ProgrammeFiltersKs4Options
                  key={key}
                  data={data}
                  slugs={slugs}
                  ks4Options={ks4Options}
                  ks4OptionFilterDimensions={ks4OptionFilterDimensions}
                />
              );
            case "threads":
              return <BrowseFiltersThreads key={key} data={data} />;
            case "years":
              return <BrowseFiltersYears key={key} data={data} />;
            case "subjectCategories":
              return (
                <BrowseFiltersSubjectCategories
                  key={key}
                  data={data}
                  slugs={slugs}
                />
              );
            case "childSubjects":
              return <BrowseFiltersChildSubjects key={key} data={data} />;
            case "tiers":
              return <BrowseFiltersTiers key={key} data={data} />;
          }
        },
      )}
    </>
  );
}
