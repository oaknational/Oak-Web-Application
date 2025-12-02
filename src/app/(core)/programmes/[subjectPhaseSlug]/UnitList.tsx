import { OakFlex, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

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

const UnitList = styled("ol")`
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const UnitListItem = styled("li")`
  margin: 0;
  liststyle: none;
  padding: 0;
  display: flex;
  width: 240px;
  flex-grow: 1;
  position: relative;
`;

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
}: Readonly<ProgrammeUnitListProps>) {
  // const { track } = useAnalytics();
  // const { analyticsUseCase } = useAnalyticsPageProps();

  // const onClick = (unit: Unit, isHighlighted: boolean) => {
  // TD: [integrated journey] analytics
  // track.unitOverviewAccessed(
  //   buildUnitOverviewAccessedAnalytics({
  //     unit,
  //     isHighlighted,
  //     componentType: "unit_info_button",
  //     selectedThread,
  //     analyticsUseCase,
  //   }),
  //);
  //};

  function getItems(unit: Unit, index: number) {
    const isHighlighted = isHighlightedUnit(unit, filters.threads);

    return (
      <UnitListItem key={`${unit.slug}-${index}`}>
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
        />
      </UnitListItem>
    );
  }

  return (
    <OakFlex
      $flexWrap={"wrap"}
      $pt="spacing-12"
      data-testid="unit-cards"
      $gap={"spacing-16"}
      // TODO: Remove hack
      style={{
        marginBottom: "-1rem",
      }}
    >
      <UnitList role="list">
        {units.length < 1 && (
          <OakP>
            {getSubjectCategoryMessage(
              yearData,
              year,
              filters.subjectCategories,
            )}
          </OakP>
        )}
        {units.map(getItems)}
        {/* Empty tiles for correct flex wrapping */}
        {new Array(3).fill(true).map((item, index) => {
          return (
            <OakFlex
              key={`unit-list-item-${item}-${index}`}
              $width={"spacing-240"}
              $flexGrow={1}
              $position={"relative"}
            />
          );
        })}
      </UnitList>
    </OakFlex>
  );
}
