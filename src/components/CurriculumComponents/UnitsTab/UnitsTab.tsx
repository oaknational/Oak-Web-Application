import React, { useState } from "react";
import { OakHeading, OakBox } from "@oaknational/oak-components";

import CurricVisualiser from "../CurricVisualiser";
import { CurricVisualiserLayout } from "../CurricVisualiserLayout";
import CurricVisualiserFiltersMobile from "../CurricVisualiserFiltersMobile";
import CurricVisualiserFiltersDesktop from "../CurricVisualiserFiltersDesktop";

import { CurriculumFilters } from "@/utils/curriculum/types";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  getNumberOfSelectedUnits,
  highlightedUnitCount,
} from "@/utils/curriculum/filtering";
import useMediaQuery from "@/hooks/useMediaQuery";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
  filters: CurriculumFilters;
  onChangeFilters: (newFilter: CurriculumFilters) => void;
  slugs: CurriculumSelectionSlugs;
  basePath: string;
  selectedUnitSlug?: string;
  ks4Options: Ks4Option[];
};

export default function UnitsTab({
  trackingData,
  formattedData,
  filters,
  onChangeFilters,
  slugs,
  basePath,
  selectedUnitSlug,
  ks4Options,
}: UnitsTabProps) {
  // Initialize constants
  const isMobile = useMediaQuery("mobile");
  const { yearData, threadOptions } = formattedData;
  const { ks4OptionSlug } = trackingData;

  const [mobileSelectedYear, setMobileSelectedYear] = useState<string>("");

  const unitCount = getNumberOfSelectedUnits(yearData, filters);

  const highlightedUnits = highlightedUnitCount(
    yearData,
    filters,
    filters.threads,
  );

  const setVisibleMobileYearRefID = (refId: string) => {
    setMobileSelectedYear(refId);
  };

  return (
    <OakBox>
      <OakBox
        id="curriculum-units"
        aria-labelledby="curriculum-unit-sequence-heading"
        $maxWidth={"all-spacing-24"}
        $mh={"auto"}
        $ph={["inner-padding-none", "inner-padding-l"]}
        $mt={["space-between-none", "space-between-l", "space-between-l"]}
        $width={"100%"}
        role="region"
      >
        <ScreenReaderOnly>
          <OakHeading
            id="curriculum-unit-sequence-heading"
            tag="h2"
            $mb="space-between-m"
            $ml={["space-between-s", "space-between-none"]}
            $font={["heading-5", "heading-4"]}
          >
            Unit sequence
          </OakHeading>
        </ScreenReaderOnly>
        {isMobile && (
          <CurricVisualiserFiltersMobile
            selectedYear={mobileSelectedYear}
            onSelectYear={setMobileSelectedYear}
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={formattedData}
            slugs={slugs}
            onOpenModal={() => {}}
            trackingData={trackingData}
            ks4Options={ks4Options}
          />
        )}
        <CurricVisualiserLayout
          filters={
            isMobile ? null : (
              <CurricVisualiserFiltersDesktop
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={formattedData}
                slugs={slugs}
                ks4Options={ks4Options}
              />
            )
          }
          units={
            <CurricVisualiser
              selectedUnitSlug={selectedUnitSlug}
              basePath={basePath}
              filters={filters}
              ks4OptionSlug={ks4OptionSlug}
              ks4Options={ks4Options}
              yearData={yearData}
              setVisibleMobileYearRefID={setVisibleMobileYearRefID}
              threadOptions={threadOptions}
            />
          }
        />
        <ScreenReaderOnly aria-live="polite" aria-atomic="true">
          <p>
            {unitCount} {unitCount === 1 ? "unit" : "units"} shown,
          </p>
          {filters.threads[0] && (
            <p>
              {highlightedUnits}
              {highlightedUnits === 1 ? "unit" : "units"}
              highlighted
            </p>
          )}
        </ScreenReaderOnly>
      </OakBox>
      <UnitTabBanner />
    </OakBox>
  );
}
