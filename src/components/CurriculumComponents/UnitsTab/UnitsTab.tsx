import React, { useState, useLayoutEffect } from "react";
import { OakP, OakHeading, OakBox } from "@oaknational/oak-components";

import CurriculumVisualiser from "../CurriculumVisualiser/CurriculumVisualiser";
import CurriculumVisualiserLayout from "../CurriculumVisualiserLayout/CurriculumVisualiserLayout";
import CurriculumVisualiserFiltersMobile from "../CurriculumVisualiserFilters/CurriculumVisualiserFiltersMobile";
import CurriculumVisualiserFilters from "../CurriculumVisualiserFilters/CurriculumVisualiserFilters";
import SizeMonitor from "../OakComponentsKitchen/SizeMonitor";

import {
  Thread,
  Subject,
  Tier,
  Unit,
  SubjectCategory,
  YearSelection,
} from "@/utils/curriculum/types";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
};

export default function UnitsTab({
  trackingData,
  formattedData,
}: UnitsTabProps) {
  // Initialize constants
  const { yearData, initialYearSelection } = formattedData;
  const { ks4OptionSlug } = trackingData;
  const [unitData, setUnitData] = useState<Unit | null>(null);

  const [yearSelection, setYearSelection] = useState<YearSelection>({
    ...initialYearSelection,
  });

  // This useLayoutEffect hook should be deprecated once the url structure of the visualiser should be updated
  useLayoutEffect(() => {
    setYearSelection(initialYearSelection);
  }, [initialYearSelection]);

  const [selectedThread, setSelectedThread] = useState<Thread["slug"] | null>(
    null,
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedYearMobile, setSelectedYearMobile] = useState<string>("");
  const [mobileHeaderScrollOffset, setMobileHeaderScrollOffset] =
    useState<number>(0);
  const [, /*visibleMobileYearRefID*/ setVisibleMobileYearRefID] = useState<
    string | null
  >(null);

  function handleSelectSubject(year: string, subject: Subject) {
    const selection = { ...yearSelection[year] };
    selection.subject = subject;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectSubjectCategory(
    year: string,
    subjectCategory: SubjectCategory,
  ) {
    const selection = { ...yearSelection[year] };
    selection.subjectCategory = subjectCategory;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectTier(year: string, tier: Tier) {
    const selection = { ...yearSelection[year] };
    selection.tier = tier;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

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
        <SizeMonitor onChange={(b) => setMobileHeaderScrollOffset(b.height)}>
          <CurriculumVisualiserFiltersMobile
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
            selectedYear={selectedYearMobile}
            onSelectYear={setSelectedYearMobile}
            data={formattedData}
            yearSelection={yearSelection}
            trackingData={trackingData}
          />
        </SizeMonitor>
        <CurriculumVisualiserLayout
          filters={
            <CurriculumVisualiserFilters
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              data={formattedData}
              yearSelection={yearSelection}
              trackingData={trackingData}
            />
          }
          units={
            <CurriculumVisualiser
              unitData={unitData}
              yearSelection={yearSelection}
              selectedYear={selectedYear}
              ks4OptionSlug={ks4OptionSlug}
              yearData={yearData}
              handleSelectSubjectCategory={handleSelectSubjectCategory}
              handleSelectSubject={handleSelectSubject}
              handleSelectTier={handleSelectTier}
              mobileHeaderScrollOffset={mobileHeaderScrollOffset}
              setUnitData={setUnitData}
              selectedThread={selectedThread}
              setVisibleMobileYearRefID={setVisibleMobileYearRefID}
            />
          }
        />
      </OakBox>
      <UnitTabBanner />
    </OakBox>
  );
}
