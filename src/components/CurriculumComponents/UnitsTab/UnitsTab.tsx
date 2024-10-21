import React, { FC, useState, useLayoutEffect } from "react";
import { OakP, OakHeading } from "@oaknational/oak-components";

import CurriculumVisualiser from "../CurriculumVisualiser/CurriculumVisualiser";
import CurriculumVisualiserLayout from "../CurriculumVisualiserLayout/CurriculumVisualiserLayout";
import CurriculumVisualiserFiltersMobile from "../CurriculumVisualiserFilters/CurriculumVisualiserFiltersMobile";
import CurriculumVisualiserFilters from "../CurriculumVisualiserFilters/CurriculumVisualiserFilters";
import { HeightMonitor } from "../OakComponentsKitchen/HeightMonitor";

import {
  Thread,
  Subject,
  Tier,
  Unit,
  SubjectCategory,
  YearSelection,
} from "@/utils/curriculum/types";
import Box from "@/components/SharedComponents/Box";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

// Types and interfaces

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
};

// Function component

const UnitsTab: FC<UnitsTabProps> = ({ trackingData, formattedData }) => {
  // Initialize constants
  const { yearData, initialYearSelection } = formattedData;
  const { examboardSlug } = trackingData;
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
    <Box>
      <Box
        id="curriculum-units"
        aria-labelledby="curriculum-unit-sequence-heading"
        $maxWidth={1280}
        $mh={"auto"}
        $ph={[0, 18]}
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
        <HeightMonitor onChange={setMobileHeaderScrollOffset}>
          <CurriculumVisualiserFiltersMobile
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            data={formattedData}
            yearSelection={yearSelection}
            trackingData={trackingData}
          />
        </HeightMonitor>
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
              examboardSlug={examboardSlug}
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
      </Box>
      <UnitTabBanner />
    </Box>
  );
};
export default UnitsTab;
