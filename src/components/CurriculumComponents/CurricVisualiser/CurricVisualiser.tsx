import { join } from "path";

import { useRef, useEffect, useMemo } from "react";
import { OakBox } from "@oaknational/oak-components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import Alert from "../OakComponentsKitchen/Alert";
import CurricUnitModal from "../CurricUnitModal";
import { CurricVisualiserUnitList } from "../CurricVisualiserUnitList";
import { CurricYearCard } from "../CurricYearCard";

import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import {
  getYearGroupTitle,
  getYearSubheadingText,
} from "@/utils/curriculum/formatting";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import {
  CurriculumFilters,
  Unit,
  YearData,
  Thread,
  UnitOption,
} from "@/utils/curriculum/types";
import { getShouldDisplayCorePathway } from "@/utils/curriculum/pathways";
import {
  groupUnitsByPathway,
  applyFiltering,
  getModes,
} from "@/utils/curriculum/by-pathway";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

type CurricVisualiserProps = {
  unitData: Unit | undefined;
  unitOptionData: UnitOption | undefined;
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
  mobileHeaderScrollOffset?: number;
  setVisibleMobileYearRefID: (refID: string) => void;
  threadOptions: Thread[];
  basePath: string;
  ks4Options: Ks4Option[];
};

// Function component

export default function CurricVisualiser({
  unitData,
  unitOptionData,
  yearData,
  mobileHeaderScrollOffset,
  filters,
  setVisibleMobileYearRefID,
  threadOptions,
  basePath,
  ks4OptionSlug,
  ks4Options,
}: CurricVisualiserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const displayModal = !!unitData;

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

  const handleCloseModal = () => {
    const searchParamsStr = searchParams?.toString() ?? "";
    const href = `${basePath}${!searchParamsStr ? "" : `?${searchParamsStr}`}`;
    router.replace(href, undefined, { shallow: true, scroll: false });
  };

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
          filters,
          shouldDisplayCorePathway ? type : null,
          actions,
        );

        const searchParamsStr = searchParams?.toString() ?? "";
        const unitUrl =
          join(basePath, units[0] ? units[0].slug : "") +
          `${!searchParamsStr ? "" : `?${searchParamsStr}`}`;

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
              isExamboard={type === "non_core"}
              yearTitle={yearTitle}
              yearSubheading={yearSubheadingText}
              additional={
                isSwimming && (
                  <Alert
                    $mb="space-between-s"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )
              }
            >
              <CurricVisualiserUnitList
                units={units}
                filters={filters}
                year={year}
                yearData={yearData}
                href={unitUrl}
              />
            </CurricYearCard>
          </OakBox>
        );
      })}

      <CurricUnitModal
        open={displayModal}
        onClose={handleCloseModal}
        unitData={unitData}
        unitOptionData={unitOptionData}
        yearData={yearData}
        basePath={basePath}
        selectedThread={selectedThread}
        filters={filters}
        ks4OptionSlug={ks4OptionSlug}
      />
    </OakBox>
  );
}
