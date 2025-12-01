"use client";

import { OakBox, OakHeading } from "@oaknational/oak-components";
import { useMemo, useState } from "react";

import ProgrammeSequence from "./Sequence";

import CurricVisualiserFiltersMobile from "@/components/CurriculumComponents/CurricVisualiserFiltersMobile";
import { CurricVisualiserLayout } from "@/components/CurriculumComponents/CurricVisualiserLayout";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import ProgrammePageFiltersDesktop from "@/app/(core)/programmes/[subjectPhaseSlug]/DesktopFilters";
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
} from "@/utils/curriculum/filtering";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumFilters } from "@/utils/curriculum/types";

type ProgrammePageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
};

export const Programme = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  curriculumUnitsFormattedData,
}: ProgrammePageProps) => {
  const isMobile = useMediaQuery("mobile");

  const { yearData, threadOptions } = curriculumUnitsFormattedData;
  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;

  const ks4Options =
    curriculumPhaseOptions.subjects.find((s) => s.slug === subjectSlug)!
      .ks4_options ?? [];
  const ks4Option = ks4Options.find((ks4opt) => ks4opt.slug === ks4OptionSlug);

  // TODO: [integrated journey] tracking
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

  // TODO: [integrated journey] analytics
  //   const { track } = useAnalytics();
  //   const { analyticsUseCase } = useAnalyticsPageProps();

  const onChangeFilters = (newFilters: CurriculumFilters) => {
    setFilters(newFilters);

    // const analyticsData = buildUnitSequenceRefinedAnalytics(
    //   analyticsUseCase,
    //   curriculumUnitsTrackingData,
    //   newFilters,
    // );

    // track.unitSequenceRefined(analyticsData);
  };

  return (
    <OakBox>
      <OakBox
        id="curriculum-units"
        aria-labelledby="curriculum-unit-sequence-heading"
        tabIndex={-1}
        $maxWidth={"spacing-1280"}
        $mh={"auto"}
        $ph={["spacing-0", "spacing-20"]}
        $mt={["spacing-0", "spacing-48", "spacing-48"]}
        $width={"100%"}
        role="region"
      >
        <ScreenReaderOnly>
          <OakHeading
            id="curriculum-unit-sequence-heading"
            tag="h2"
            $mb="spacing-24"
            $ml={["spacing-16", "spacing-0"]}
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
            data={curriculumUnitsFormattedData}
            slugs={curriculumSelectionSlugs}
            onOpenModal={() => {}} // TODO: [integrated journey] remove modal
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
          curriculumSeoText={undefined} // TODO: [integrated journey] seo text
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
    </OakBox>
  );
};
