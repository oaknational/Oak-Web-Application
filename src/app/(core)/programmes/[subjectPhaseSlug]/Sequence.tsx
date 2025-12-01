"use client";

import { useRef, useEffect, useMemo } from "react";
import { OakBox } from "@oaknational/oak-components";

import { ProgrammeUnitList } from "./UnitList";

import useMediaQuery from "@/hooks/useMediaQuery";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import {
  getYearGroupTitle,
  getYearSubheadingText,
} from "@/utils/curriculum/formatting";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { CurriculumFilters, YearData, Thread } from "@/utils/curriculum/types";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import {
  groupUnitsByPathway,
  applyFiltering,
  getModes,
} from "@/utils/curriculum/by-pathway";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";
import { CurricYearCard } from "@/components/CurriculumComponents/CurricYearCard";
import Alert from "@/components/CurriculumComponents/OakComponentsKitchen/Alert";

type ProgrammeSequenceProps = {
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
  mobileHeaderScrollOffset?: number;
  setVisibleMobileYearRefID: (refID: string) => void;
  threadOptions: Thread[];
  ks4Options: Ks4Option[];
};

// TODO: [integrated journey] remove original component, CurriculumVisualiser, once launched

export default function ProgrammeSequence({
  yearData,
  mobileHeaderScrollOffset,
  filters,
  setVisibleMobileYearRefID,
  threadOptions,
  ks4OptionSlug,
  ks4Options,
}: Readonly<ProgrammeSequenceProps>) {
  const isMobile = useMediaQuery("mobile");

  const visualiserFilters = useMemo(() => {
    if (isMobile) {
      return {
        ...filters,
        years: Object.keys(yearData),
        pathways: [],
      };
    }
    return filters;
  }, [isMobile, filters, yearData]);

  const shouldIncludeCore = isMobile || ks4OptionSlug !== "core";
  const unitsByYearSelector = applyFiltering(
    visualiserFilters,
    groupUnitsByPathway({
      modes: getModes(
        shouldIncludeCore,
        ks4Options,
        visualiserFilters.pathways[0],
      ),
      yearData,
    }),
  );

  const selectedThread = useMemo(() => {
    return threadOptions.find(
      (thread) => thread.slug === visualiserFilters.threads[0],
    );
  }, [threadOptions, visualiserFilters]);

  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  /* Intersection observer to update year filter selection when
  scrolling through the visualiser on mobile */
  useEffect(() => {
    const options = { rootMargin: "-50% 0px 0px 0px" };
    const yearsLoaded = Object.keys(yearData).length;
    // All refs have been created for year groups & data is loaded
    if (yearsLoaded > 0) {
      // const io = new IntersectionObserver(, options);
      const io = new IntersectionObserver(
        anchorIntersectionObserver(setVisibleMobileYearRefID),
        options,
      );

      itemEls.current.forEach((el) => {
        if (el) {
          io.observe(el);
        }
      });
      return () => {
        io.disconnect();
      };
    }
  }, [setVisibleMobileYearRefID, yearData]);

  const shouldDisplayCorePathway = getShouldDisplayCorePathway(ks4Options);

  return (
    <OakBox id="content" data-testid="curriculum-visualiser">
      {Object.entries(unitsByYearSelector).flatMap(([, data], index) => {
        const { year, type, isSwimming, units } = data;
        const ref = (element: HTMLDivElement) => {
          itemEls.current[index] = element;
        };

        const actions = units[0]?.actions;

        const yearTitle = getYearGroupTitle(yearData, year, undefined);

        const yearSubheadingText = getYearSubheadingText(
          yearData,
          year,
          visualiserFilters,
          shouldDisplayCorePathway ? type : null,
          actions,
        );

        return (
          <OakBox
            data-testid={`year-${type}-${year}`}
            ref={ref}
            key={`${year}-${type}`}
            $position={"relative"}
            id={`year-${type}-${year}`}
          >
            <AnchorTarget
              $paddingTop={mobileHeaderScrollOffset}
              id={`year-${type}-${year}`}
            />
            <CurricYearCard
              timetablingUrl={undefined}
              isExamboard={type === "non_core"}
              yearTitle={yearTitle}
              yearSubheading={yearSubheadingText}
              additional={
                isSwimming && (
                  <Alert
                    $mb="spacing-16"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )
              }
            >
              <ProgrammeUnitList
                units={units}
                filters={visualiserFilters}
                year={year}
                yearData={yearData}
                selectedThread={selectedThread}
              />
            </CurricYearCard>
          </OakBox>
        );
      })}
    </OakBox>
  );
}
