"use client";

import { useMemo } from "react";
import { OakBox } from "@oaknational/oak-components";

import { ProgrammeUnitList } from "./UnitList";
import { ProgrammeYear } from "./Year";
import { getSubheadingIconName } from "./getSubheadingIconName";

import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import {
  getYearGroupTitle,
  getYearSubheadingText,
} from "@/utils/curriculum/formatting";
import { CurriculumFilters, YearData, Thread } from "@/utils/curriculum/types";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import {
  groupUnitsByPathway,
  applyFiltering,
  getModes,
} from "@/utils/curriculum/by-pathway";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

type ProgrammeSequenceProps = {
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
  mobileHeaderScrollOffset?: number;
  threadOptions: Thread[];
  ks4Options: Ks4Option[];
};

// TD: [integrated journey] remove original component, CurriculumVisualiser, once launched

export default function ProgrammeSequence({
  yearData,
  mobileHeaderScrollOffset,
  filters,
  threadOptions,
  ks4OptionSlug,
  ks4Options,
}: Readonly<ProgrammeSequenceProps>) {
  const shouldIncludeCore = ks4OptionSlug !== "core";

  const unitsByYearSelector = applyFiltering(
    filters,
    groupUnitsByPathway({
      modes: getModes(shouldIncludeCore, ks4Options, filters.pathways[0]),
      yearData,
    }),
  );

  const selectedThread = useMemo(() => {
    return threadOptions.find((thread) => thread.slug === filters.threads[0]);
  }, [threadOptions, filters]);

  const shouldDisplayCorePathway = getShouldDisplayCorePathway(ks4Options);

  return (
    <OakBox id="content">
      {Object.entries(unitsByYearSelector).flatMap(([, data]) => {
        const { year, type, isSwimming, units } = data;

        const actions = units[0]?.actions;

        const yearTitle = getYearGroupTitle(yearData, year);
        const pathway = shouldDisplayCorePathway ? type : null;
        const yearSubheadingText = isSwimming
          ? "Swimming and water safety units should be selected based on the ability and experience of your pupils."
          : getYearSubheadingText(yearData, year, filters, pathway, actions);
        const yearSubheadingIconName = isSwimming
          ? "swimming"
          : getSubheadingIconName(year, units, yearData[year], filters);

        return (
          <OakBox
            data-testid={`year-${type}-${year}`}
            key={`${year}-${type}`}
            $position={"relative"}
            id={`year-${type}-${year}`}
          >
            <AnchorTarget
              $paddingTop={mobileHeaderScrollOffset}
              id={`year-${type}-${year}`}
            />
            <ProgrammeYear
              year={year}
              yearTitle={
                yearTitle.match(/Year \d+/) ? `${yearTitle} units` : yearTitle
              }
              yearSubheading={yearSubheadingText}
              yearSubheadingIconName={yearSubheadingIconName}
            >
              <ProgrammeUnitList
                units={units}
                filters={filters}
                year={year}
                yearData={yearData}
                selectedThread={selectedThread}
              />
            </ProgrammeYear>
          </OakBox>
        );
      })}
    </OakBox>
  );
}
