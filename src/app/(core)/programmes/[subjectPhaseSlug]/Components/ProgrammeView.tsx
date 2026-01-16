"use client";

import { OakBox, OakHeading } from "@oaknational/oak-components";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProgrammePageFiltersMobile from "./Filters/ProgrammePageFiltersMobile";
import ProgrammePageFiltersDesktop from "./Filters/ProgrammePageFiltersDesktop";
import ProgrammeSequence from "./Sequence";
import { ProgrammeHeader } from "./ProgrammeHeader";
import { SubjectHeroImageName } from "./getSubjectHeroImageUrl";

import { CurricVisualiserLayout } from "@/components/CurriculumComponents/CurricVisualiserLayout";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  getDefaultFilter,
  getNumberOfSelectedUnits,
  highlightedUnitCount,
  useFilters,
} from "@/utils/curriculum/filteringApp";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { buildUnitSequenceRefinedAnalytics } from "@/utils/curriculum/analytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  phaseTitle: string;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
};

export const ProgrammeView = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  phaseTitle,
  curriculumUnitsFormattedData,
}: ProgrammePageProps) => {
  const isMobile = useMediaQuery("mobile");
  const searchParams = useSearchParams();

  const { yearData, threadOptions } = curriculumUnitsFormattedData;
  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;

  const ks4Options =
    curriculumPhaseOptions.subjects.find((s) => s.slug === subjectSlug)!
      .ks4_options ?? [];
  const ks4Option = ks4Options.find((ks4opt) => ks4opt.slug === ks4OptionSlug);

  // TD: [integrated journey] tracking
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle,
    ks4OptionSlug: ks4Option?.slug,
    ks4OptionTitle: ks4Option?.title,
  };

  const [mobileSelectedYear, setMobileSelectedYear] = useState<string>("");

  const defaultFilter = useMemo(() => {
    return getDefaultFilter(curriculumUnitsFormattedData);
  }, [curriculumUnitsFormattedData]);

  const [filters, setFilters] = useFilters(defaultFilter);

  const unitCount = getNumberOfSelectedUnits(yearData, filters);

  const subjectForLayout = curriculumPhaseOptions.subjects.find(
    (s) => s.slug === curriculumSelectionSlugs.subjectSlug,
  );

  if (!subjectForLayout) {
    throw new Error(
      "Selected subject not found in curriculumPhaseOptions for programme page",
    );
  }

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
      curriculumUnitsTrackingData,
      newFilters,
    );

    track.unitSequenceRefined(analyticsData);
  };

  const schoolYear = filters.years.find(
    (year) => searchParams?.get("years") === year,
  );

  return (
    <>
      <ProgrammeHeader
        subject={subjectForLayout.slug as SubjectHeroImageName}
        subjectTitle={subjectTitle}
        phaseTitle={phaseTitle}
        schoolYear={schoolYear}
        summary="This is some placeholder text for the summary. If this goes into production then we've still got work to do."
        bullets={[
          "This is a bullet point",
          "This is another bullet point",
          "This is a third bullet point",
        ]}
      />
      <OakBox
        id="programme-units"
        aria-labelledby="programme-unit-sequence-heading"
        tabIndex={-1}
        $maxWidth={"spacing-1280"}
        $mh={"auto"}
        $ph={["spacing-0", "spacing-20"]}
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
        {isMobile && (
          <ProgrammePageFiltersMobile
            selectedYear={mobileSelectedYear}
            onSelectYear={setMobileSelectedYear}
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={curriculumUnitsFormattedData}
            slugs={curriculumSelectionSlugs}
            trackingData={curriculumUnitsTrackingData}
            ks4Options={ks4Options}
          />
        )}
        <CurricVisualiserLayout
          filters={
            isMobile ? null : (
              <ProgrammePageFiltersDesktop
                filters={filters}
                onChangeFilters={onChangeFilters}
                data={curriculumUnitsFormattedData}
                slugs={curriculumSelectionSlugs}
                ks4Options={ks4Options}
              />
            )
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
          subject={subjectForLayout}
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
    </>
  );
};
