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
} from "@/utils/curriculum/filtering";
import { CurriculumFilters } from "@/utils/curriculum/types";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumPhaseOption } from "@/node-lib/curriculum-api-2023";

type UnitSequenceViewProps = {
  filters: CurriculumFilters;
  setFilters: (newFilters: CurriculumFilters) => void;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  subjectTitle: string;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  subjectForLayout: CurriculumPhaseOption;
};

export const UnitSequenceView = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
  subjectTitle,
  curriculumUnitsFormattedData,
  filters,
  setFilters,
  subjectForLayout,
}: UnitSequenceViewProps) => {
  const isMobile = useMediaQuery("mobile");
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
      curriculumUnitsTrackingData,
      newFilters,
    );

    track.unitSequenceRefined(analyticsData);
  };

  return (
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
  );
};
