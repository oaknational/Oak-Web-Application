import {
  ProgrammeFiltersKs4Options,
  shouldDisplayKs4OptionsFilter,
} from "./ProgrammeFiltersKs4Options";
import { BrowseFiltersThreads } from "./BrowseFilters/BrowseFiltersThreads";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";
import { BrowseFiltersKeystages } from "./BrowseFilters/BrowseFiltersKeystages";
import { BrowseFiltersChildSubjects } from "./BrowseFilters/BrowseFiltersChildSubjects";
import { BrowseFiltersSubjectCategories } from "./BrowseFilters/BrowseFiltersSubjectCategories";
import { BrowseFiltersTiers } from "./BrowseFilters/BrowseFiltersTiers";
import { BrowseFiltersYears } from "./BrowseFilters/BrowseFiltersYears";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { shouldDisplayFilter } from "@/utils/curriculum/filtering";
import { useBrowseFilters } from "@/context/BrowseFilters";

export const useDisplayedFilters = (
  data: CurriculumUnitsFormattedData,
  slugs: CurriculumSelectionSlugs,
  ks4Options: Ks4Option[],
) => {
  const { filters } = useBrowseFilters();

  return [
    {
      key: "keystages",
      shouldDisplayFilter: data.keystages.length > 1,
    },
    {
      // only show year options when there is more than 1, because all content
      // will be in a year so a single year option is equivalent to 'all'
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
  return (
    <>
      {useDisplayedFilters(data, slugs, ks4Options).map(
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
            case "keystages":
              return <BrowseFiltersKeystages key={key} data={data} />;
          }
        },
      )}
    </>
  );
}
