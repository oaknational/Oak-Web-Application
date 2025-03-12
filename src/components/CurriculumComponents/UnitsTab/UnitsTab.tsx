import React, { useState, useLayoutEffect } from "react";
import { OakP, OakHeading, OakBox } from "@oaknational/oak-components";

import CurriculumVisualiser from "../CurriculumVisualiser/CurriculumVisualiser";
import CurriculumVisualiserLayout from "../CurriculumVisualiserLayout/CurriculumVisualiserLayout";
import CurriculumVisualiserFiltersMobile from "../CurriculumVisualiserFilters/CurriculumVisualiserFiltersMobile";
import CurriculumVisualiserFilters from "../CurriculumVisualiserFilters/CurriculumVisualiserFilters";
import { highlightedUnitCount } from "../CurriculumVisualiserFilters/helpers";

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
import { getNumberOfSelectedUnits } from "@/utils/curriculum/getNumberOfSelectedUnits";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { PhaseValueType } from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
};

export default function UnitsTab({
  trackingData,
  formattedData,
}: UnitsTabProps) {
  // Initialize constants
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const { yearData, initialYearSelection, threadOptions } = formattedData;
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
  // const [visibleMobileYearRefID, setVisibleMobileYearRefID] = useState<
  //   string | null
  // >(null);

  const setVisibleMobileYearRefID = (newYear: string) => {
    setSelectedYearMobile(newYear);
  };

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

  const highlightedUnits = highlightedUnitCount(
    yearData,
    selectedYear,
    yearSelection,
    selectedThread,
  );

  // Get number of units
  const unitCount = getNumberOfSelectedUnits(
    yearData,
    selectedYear,
    yearSelection,
  );

  function trackSelectThread(thread: Thread): void {
    if (trackingData) {
      const { subjectTitle, subjectSlug, phaseSlug } = trackingData;
      track.programmeThreadHighlighted({
        subjectTitle: subjectTitle,
        subjectSlug: subjectSlug,
        threadTitle: thread.title,
        threadSlug: thread.slug,
        platform: "owa",
        product: "curriculum visualiser",
        componentType: "unit_sequence_tab",
        eventVersion: "2.0.0",
        engagementIntent: "refine",
        analyticsUseCase: analyticsUseCase,
        phase: phaseSlug as PhaseValueType,
        order: thread.order, // int (min 0)
      });
    }
  }

  function handleSelectThread(threadSlug: string): void {
    const thread = threadOptions.find((to) => to.slug === threadSlug) ?? null;
    if (thread) {
      trackSelectThread(thread);
    }
    setSelectedThread(threadSlug);
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
        <CurriculumVisualiserFiltersMobile
          selectedThread={selectedThread}
          onSelectThread={handleSelectThread}
          selectedYear={selectedYearMobile}
          onSelectYear={setSelectedYearMobile}
          data={formattedData}
          yearSelection={yearSelection}
          trackingData={trackingData}
        />
        <CurriculumVisualiserLayout
          filters={
            <CurriculumVisualiserFilters
              selectedThread={selectedThread}
              onSelectThread={handleSelectThread}
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
              setUnitData={setUnitData}
              selectedThread={selectedThread}
              setVisibleMobileYearRefID={setVisibleMobileYearRefID}
            />
          }
        />
        <ScreenReaderOnly aria-live="polite" aria-atomic="true">
          <p>
            {unitCount} {unitCount === 1 ? "unit" : "units"} shown,
          </p>
          {selectedThread && (
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
