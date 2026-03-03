import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import ProgrammePageFiltersDesktop from "../Filters/ProgrammePageFiltersDesktop";
import ProgrammePageFiltersMobile from "../Filters/ProgrammePageFiltersMobile";

import ProgrammeSequence from "./Sequence";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
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
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import type { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export type UnitSequenceViewProps = {
  filters: CurriculumFilters;
  setFilters: (newFilters: CurriculumFilters) => void;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  ks4Options: Ks4Option[];
  trackingData: CurriculumUnitsTrackingData;
};

export const UnitSequenceView = ({
  filters,
  setFilters,
  curriculumSelectionSlugs,
  curriculumUnitsFormattedData,
  ks4Options,
  trackingData,
}: UnitSequenceViewProps) => {
  const { yearData, threadOptions } = curriculumUnitsFormattedData;
  const { ks4OptionSlug } = curriculumSelectionSlugs;

  const unitCount = getNumberOfSelectedUnits(yearData, filters);

  const highlightedUnits = highlightedUnitCount(
    yearData,
    filters,
    filters.threads,
  );

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
    <OakBox $ph={["spacing-20", "spacing-40"]}>
      <OakBox
        id="programme-units"
        aria-labelledby="programme-unit-sequence-heading"
        tabIndex={-1}
        $mh={"auto"}
        $mt={["spacing-0", "spacing-48", "spacing-48"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
        $color="text-primary"
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
        <OakBox $display={["block", "block", "none"]}>
          <ProgrammePageFiltersMobile
            filters={filters}
            onChangeFilters={onChangeFilters}
            data={curriculumUnitsFormattedData}
            slugs={curriculumSelectionSlugs}
            ks4Options={ks4Options}
          />
        </OakBox>
        <OakGrid $cg={"spacing-16"}>
          <OakGridArea
            $colSpan={[12, 12, 3]}
            $display={["none", "none", "block"]}
          >
            <ProgrammePageFiltersDesktop
              filters={filters}
              onChangeFilters={onChangeFilters}
              data={curriculumUnitsFormattedData}
              slugs={curriculumSelectionSlugs}
              ks4Options={ks4Options}
            />
          </OakGridArea>
          <OakGridArea $colSpan={[12, 12, 9]}>
            <ProgrammeSequence
              filters={filters}
              ks4OptionSlug={ks4OptionSlug}
              ks4Options={ks4Options}
              yearData={yearData}
              threadOptions={threadOptions}
            />
          </OakGridArea>
        </OakGrid>
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
