import { OakGrid, OakGridArea, OakP } from "@oaknational/oak-components";

import { isHighlightedUnit } from "@/utils/curriculum/filtering";
import {
  CurriculumFilters,
  Thread,
  Unit,
  YearData,
} from "@/utils/curriculum/types";
import { getSubjectCategoryMessage } from "@/utils/curriculum/formatting";
import CurricUnitCard from "@/components/CurriculumComponents/CurricUnitCard";
import { resolveOakHref } from "@/common-lib/urls";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";

type ProgrammeUnitListProps = {
  units: Unit[];
  filters: CurriculumFilters;
  year: string;
  yearData: YearData;
  selectedThread?: Thread;
};
export function ProgrammeUnitList({
  units,
  yearData,
  year,
  filters,
  selectedThread,
}: Readonly<ProgrammeUnitListProps>) {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const onClick = (unit: Unit, isHighlighted: boolean) => {
    track.unitOverviewAccessed(
      buildUnitOverviewAccessedAnalytics({
        unit,
        isHighlighted,
        componentType: "unit_info_button",
        selectedThread,
        analyticsUseCase,
      }),
    );
  };

  function getItems(unit: Unit, index: number) {
    const isHighlighted = isHighlightedUnit(unit, filters.threads);

    return (
      <OakGridArea $colSpan={[12, 4]} key={`${unit.slug}-${index}`} as="li">
        <CurricUnitCard
          unit={unit}
          key={unit.slug + index}
          index={index}
          isHighlighted={isHighlighted}
          // TD: [integrated journey] optionality units
          href={resolveOakHref({
            page: "lesson-index",
            unitSlug: unit.slug,
            programmeSlug: createTeacherProgrammeSlug(unit),
          })}
          onClick={() => onClick(unit, isHighlighted)}
        />
      </OakGridArea>
    );
  }

  return (
    <OakGrid
      as="ol"
      $cg={"spacing-16"}
      $rg={"spacing-16"}
      $pa={"spacing-0"}
      $pt="spacing-12"
    >
      {units.length < 1 && (
        <OakP>
          {getSubjectCategoryMessage(yearData, year, filters.subjectCategories)}
        </OakP>
      )}
      {units.map(getItems)}
    </OakGrid>
  );
}
