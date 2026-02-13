"use client";
import { OakBox, OakHeading } from "@oaknational/oak-components";
import { useState } from "react";

import ProgrammePageFiltersDesktop from "../Filters/ProgrammePageFiltersDesktop";
import ProgrammePageFiltersMobile from "../Filters/ProgrammePageFiltersMobile";

import ProgrammeSequence from "./Sequence";

import { CurricVisualiserLayout } from "@/components/CurriculumComponents/CurricVisualiserLayout";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import useMediaQuery from "@/hooks/useMediaQuery";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { buildUnitSequenceRefinedAnalytics } from "@/utils/curriculum/analytics";
import {
  getNumberOfSelectedUnits,
  highlightedUnitCount,
} from "@/utils/curriculum/filteringApp";
import { CurriculumFilters } from "@/utils/curriculum/types";
import {
  CurriculumSelectionSlugs,
  CurriculumSelectionTitles,
} from "@/utils/curriculum/slugs";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export type UnitSequenceViewProps = {
  filters: CurriculumFilters;
  setFilters: (newFilters: CurriculumFilters) => void;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumSelectionTitles: CurriculumSelectionTitles;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  ks4Options: Ks4Option[];
  trackingData: CurriculumUnitsTrackingData;
};

export const UnitSequenceView = ({
  filters,
  setFilters,
  curriculumSelectionSlugs,
  curriculumSelectionTitles,
  curriculumUnitsFormattedData,
  ks4Options,
  trackingData,
}: UnitSequenceViewProps) => {
  const isDesktop = useMediaQuery("desktop");
  const { yearData, threadOptions } = curriculumUnitsFormattedData;
  const { ks4OptionSlug } = curriculumSelectionSlugs;
  const { subjectTitle } = curriculumSelectionTitles;

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

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const onChangeFilters = (newFilters: CurriculumFilters) => {
    setFilters(newFilters);

    const analyticsData = buildUnitSequenceRefinedAnalytics(
      analyticsUseCase,
      trackingData,
      newFilters,
    );

    track.unitSequenceRefined(analyticsData);
  };

  return (
    <OakBox
      id="programme-units"
      aria-labelledby="programme-unit-sequence-heading"
      tabIndex={-1}
      $mh={"auto"}
      $mt={["spacing-0", "spacing-48", "spacing-48"]}
      $width={"100%"}
      as="section"
    >
      <ScreenReaderOnly>
        <OakHeading
          id="programme-unit-sequence-heading"
          tag="h2"
          $mb="spacing-24"
          $ml={["spacing-16", "spacing-0"]}
          $font={["heading-5", "heading-4"]}
        >
          Unit sequence
        </OakHeading>
      </ScreenReaderOnly>
      {!isDesktop && (
        <ProgrammePageFiltersMobile
          selectedYear={mobileSelectedYear}
          onSelectYear={setMobileSelectedYear}
          filters={filters}
          onChangeFilters={onChangeFilters}
          data={curriculumUnitsFormattedData}
          slugs={curriculumSelectionSlugs}
          trackingData={trackingData}
          ks4Options={ks4Options}
        />
      )}
      <CurricVisualiserLayout
        filters={
          isDesktop ? (
            <ProgrammePageFiltersDesktop
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={curriculumUnitsFormattedData}
              slugs={curriculumSelectionSlugs}
              ks4Options={ks4Options}
            />
          ) : null
        }
        units={
          <ProgrammeSequence
            filters={filters}
            ks4OptionSlug={ks4OptionSlug}
            ks4Options={ks4Options}
            yearData={yearData}
            setVisibleMobileYearRefID={setVisibleMobileYearRefID}
            threadOptions={threadOptions}
          />
        }
        curriculumSeoText={undefined} // TD: [integrated journey] seo text
        subjectTitle={subjectTitle}
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
  );
};
