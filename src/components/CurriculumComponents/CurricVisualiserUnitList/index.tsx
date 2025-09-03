import { join } from "path";

import { OakFlex, OakP } from "@oaknational/oak-components";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";

import CurricUnitCard from "../CurricUnitCard";

import { isHighlightedUnit } from "@/utils/curriculum/filtering";
import {
  CurriculumFilters,
  Thread,
  Unit,
  YearData,
} from "@/utils/curriculum/types";
import { getSubjectCategoryMessage } from "@/utils/curriculum/formatting";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";

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

type CurricVisualiserUnitListProps = {
  units: Unit[];
  filters: CurriculumFilters;
  year: string;
  yearData: YearData;
  basePath: string;
  selectedThread?: Thread;
};
export function CurricVisualiserUnitList({
  units,
  yearData,
  year,
  filters,
  basePath,
  selectedThread,
}: CurricVisualiserUnitListProps) {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const searchParams = useSearchParams();

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
    const searchParamsStr = searchParams?.toString() ?? "";
    const unitUrl =
      join(basePath, unit.slug) +
      `${!searchParamsStr ? "" : `?${searchParamsStr}`}`;

    return (
      <UnitListItem key={`${unit.slug}-${index}`}>
        <CurricUnitCard
          unit={unit}
          key={unit.slug + index}
          index={index}
          isHighlighted={isHighlighted}
          href={unitUrl}
          onClick={() => onClick(unit, isHighlighted)}
        />
      </UnitListItem>
    );
  }

  return (
    <OakFlex
      $flexWrap={"wrap"}
      $pt="inner-padding-s"
      data-testid="unit-cards"
      $gap={"all-spacing-4"}
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
        {Array(3)
          .fill(true)
          .map((item, index) => {
            return (
              <OakFlex
                key={`unit-list-item-${item}-${index}`}
                $width={"all-spacing-19"}
                $flexGrow={1}
                $position={"relative"}
              />
            );
          })}
      </UnitList>
    </OakFlex>
  );
}
