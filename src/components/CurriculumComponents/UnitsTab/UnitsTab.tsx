import React, { useState } from "react";
import { OakHeading, OakBox } from "@oaknational/oak-components";

import CurriculumVisualiser from "../CurriculumVisualiser/CurriculumVisualiser";
import { CurricVisualiserLayout } from "../CurricVisualiserLayout";
import CurricVisualiserFiltersMobile from "../CurricVisualiserFiltersMobile";
import { CurricVisualiserFiltersDesktop } from "../CurricVisualiserFiltersDesktop";

import { CurriculumFilters, Unit } from "@/utils/curriculum/types";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getNumberOfSelectedUnits } from "@/utils/curriculum/getNumberOfSelectedUnits";
import { highlightedUnitCount } from "@/utils/curriculum/filtering";
import useMediaQuery from "@/hooks/useMediaQuery";

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
  filters: CurriculumFilters;
  onChangeFilters: (newFilter: CurriculumFilters) => void;
};

export default function UnitsTab({
  trackingData,
  formattedData,
  filters,
  onChangeFilters,
}: UnitsTabProps) {
  // Initialize constants
  const isMobile = useMediaQuery("mobile");
  const { yearData, threadOptions } = formattedData;
  const { ks4OptionSlug } = trackingData;
  const [unitData, setUnitData] = useState<Unit | null>(null);

  const [mobileSelectedYear, setMobileSelectedYear] = useState<string>("");
  const selectedYear = filters.years.length === 1 ? filters.years[0]! : "all";

  const unitCount = getNumberOfSelectedUnits(yearData, selectedYear, filters);

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
            trackingData={trackingData}
            onOpenModal={() => {}}
          />
        )}
        <CurricVisualiserLayout
          filters={
            isMobile ? null : (
              <CurricVisualiserFiltersDesktop
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={formattedData}
                trackingData={trackingData}
              />
            )
          }
          units={
            <CurriculumVisualiser
              unitData={unitData}
              filters={filters}
              ks4OptionSlug={ks4OptionSlug}
              yearData={yearData}
              setUnitData={setUnitData}
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
