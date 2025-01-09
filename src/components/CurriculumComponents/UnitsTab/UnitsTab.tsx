import React, { useState, useLayoutEffect } from "react";
import { OakP, OakHeading, OakBox } from "@oaknational/oak-components";

import CurriculumVisualiser from "../CurriculumVisualiser/CurriculumVisualiser";
import CurriculumVisualiserLayout from "../CurriculumVisualiserLayout/CurriculumVisualiserLayout";
import CurriculumVisualiserFiltersMobile from "../CurriculumVisualiserFilters/CurriculumVisualiserFiltersMobile";
import CurriculumVisualiserFilters, { CurriculumFilters } from "../CurriculumVisualiserFilters/CurriculumVisualiserFilters";

import {
  Unit,
} from "@/utils/curriculum/types";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
  filters: CurriculumFilters,
  onChangeFilters: (newFilter: CurriculumFilters) => void,
};

export default function UnitsTab({
  trackingData,
  formattedData,
  filters,
  onChangeFilters,
}: UnitsTabProps) {
  // Initialize constants
  const { yearData } = formattedData;
  const { ks4OptionSlug } = trackingData;
  const [unitData, setUnitData] = useState<Unit | null>(null);

  const unitCount: number = 0;

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
        <OakP
          $mh={["space-between-s", "space-between-none"]}
          $mb={"space-between-xl"}
          data-testid="units-heading"
        >
          Units that make up our curricula are fully sequenced, and aligned to
          the national curriculum.
        </OakP>
        <CurriculumVisualiserFiltersMobile
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={formattedData}
          trackingData={trackingData}
        />
        <CurriculumVisualiserLayout
          filters={
            <CurriculumVisualiserFilters
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={formattedData}
              trackingData={trackingData}
            />
          }
          units={
            <CurriculumVisualiser
              unitData={unitData}
              filters={filters}
              ks4OptionSlug={ks4OptionSlug}
              yearData={yearData}
              setUnitData={setUnitData}
              setVisibleMobileYearRefID={() => {}}
            />
          }
        />
        <ScreenReaderOnly aria-live="polite" aria-atomic="true">
          <p>
            {unitCount} {unitCount === 1 ? "unit" : "units"} shown,
          </p>
          {/* {selectedThread && (
            <p>
              {highlightedUnits}
              {highlightedUnits === 1 ? "unit" : "units"}
              highlighted
            </p>
          )} */}
        </ScreenReaderOnly>
      </OakBox>
      <UnitTabBanner />
    </OakBox>
  );
}
