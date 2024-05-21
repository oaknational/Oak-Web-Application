import React, { FC, useState, useLayoutEffect } from "react";
import {
  OakGrid,
  OakGridArea,
  OakP,
  OakHeading,
  OakSpan,
} from "@oaknational/oak-components";

import CurriculumVisualiser, {
  Thread,
  Subject,
  Domain,
  Discipline,
  Tier,
  Unit,
  isVisibleUnit,
} from "../CurriculumVisualiser/CurriculumVisualiser";
import UnitsTabMobile from "../UnitsTabMobile/UnitsTabMobile";

import Box from "@/components/SharedComponents/Box";
import Radio from "@/components/SharedComponents/RadioButtons/Radio";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { PhaseValueType } from "@/browser-lib/avo/Avo";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

// Types and interfaces

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
};

export interface YearSelection {
  [key: string]: {
    discipline?: Discipline | null;
    subject?: Subject | null;
    domain?: Domain | null;
    tier?: Tier | null;
  };
}

export function createProgrammeSlug(
  unitData?: Unit | null,
  examboardSlug?: string | null,
) {
  if (unitData?.keystage_slug === "ks4") {
    return `${unitData.subject_slug}-${unitData.phase_slug}-${
      unitData.keystage_slug
    }${unitData.tier_slug ? "-" + unitData.tier_slug : ""}${
      examboardSlug ? "-" + examboardSlug : ""
    }`;
  }
  return unitData
    ? `${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`
    : "";
}

// Function component

const UnitsTab: FC<UnitsTabProps> = ({ trackingData, formattedData }) => {
  // Initialize constants
  const {
    yearData,
    threadOptions,
    yearOptions,
    initialYearSelection,
    duplicateUnitSlugs: duplicateUnitSlugsList,
  } = formattedData;
  const { examboardSlug } = trackingData;
  // Flattened duplicate slugs into array for getStaticProps, so casting back into a Set
  const duplicateUnitSlugs = new Set(duplicateUnitSlugsList);
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const [unitData, setUnitData] = useState<Unit | null>(null);

  const [yearSelection, setYearSelection] = useState<YearSelection>({
    ...initialYearSelection,
  });
  // This useLayoutEffect hook should be deprecated once the url structure of the visualiser should be updated
  useLayoutEffect(() => {
    setYearSelection(initialYearSelection);
  }, [initialYearSelection]);

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [mobileHeaderScrollOffset, setMobileHeaderScrollOffset] =
    useState<number>(0);
  const [visibleMobileYearRefID, setVisibleMobileYearRefID] = useState<
    string | null
  >(null);

  // Filter interaction handlers

  function handleSelectThread(slug: string): void {
    const thread = threadOptions.find((to) => to.slug === slug) ?? null;
    if (thread) {
      trackSelectThread(thread);
    }
    setSelectedThread(thread);
  }

  function handleSelectYear(year: string): void {
    trackSelectYear(year);
    setSelectedYear(year);
  }

  function handleSelectDomain(year: string, domain: Domain) {
    const selection = { ...yearSelection[year] };
    selection.domain = domain;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectSubject(year: string, subject: Subject) {
    const selection = { ...yearSelection[year] };
    selection.subject = subject;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectDiscipline(year: string, discipline: Discipline) {
    const selection = { ...yearSelection[year] };
    selection.discipline = discipline;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectTier(year: string, tier: Tier) {
    const selection = { ...yearSelection[year] };
    selection.tier = tier;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  // Visibility helpers

  function highlightedUnitCount(): number {
    let count = 0;
    Object.keys(yearData).forEach((year) => {
      const units = yearData[year]?.units;
      if (units && (!selectedYear || selectedYear === year)) {
        units.forEach((unit) => {
          if (
            isVisibleUnit(yearSelection, year, unit) &&
            isHighlightedUnit(unit)
          ) {
            count++;
          }
        });
      }
    });
    return count;
  }

  function isHighlightedUnit(unit: Unit) {
    if (!selectedThread) {
      return false;
    }
    return unit.threads.some((t) => t.slug === selectedThread.slug);
  }

  function isSelectedThread(thread: Thread) {
    return selectedThread?.slug === thread.slug;
  }

  // Analytics handlers
  function trackSelectThread(thread: Thread): void {
    if (trackingData) {
      const { subjectTitle, subjectSlug, phaseSlug } = trackingData;
      track.curriculumThreadHighlighted({
        subjectTitle,
        subjectSlug,
        threadTitle: thread.title,
        threadSlug: thread.slug,
        phase: phaseSlug as PhaseValueType,
        order: thread.order,
        analyticsUseCase: analyticsUseCase,
      });
    }
  }

  function trackSelectYear(year: string): void {
    if (trackingData) {
      const { subjectTitle, subjectSlug } = trackingData;
      track.yearGroupSelected({
        yearGroupName: year,
        yearGroupSlug: year,
        subjectTitle,
        subjectSlug,
        analyticsUseCase: analyticsUseCase,
      });
    }
  }

  function updateMobileHeaderScroll(height: number) {
    if (!mobileHeaderScrollOffset) {
      setMobileHeaderScrollOffset(height);
    }
  }

  return (
    <Box>
      <Box $maxWidth={1280} $mh={"auto"} $ph={[0, 18]} $width={"100%"}>
        <OakHeading
          tag="h2"
          $mb="space-between-m"
          $ml={["space-between-s", "space-between-none"]}
          $font={["heading-5", "heading-4"]}
        >
          Unit sequence
        </OakHeading>
        <OakP
          $mh={["space-between-s", "space-between-none"]}
          $mb={"space-between-xl"}
          data-testid="units-heading"
        >
          Units that make up our curricula are fully sequenced, and aligned to
          the national curriculum.
        </OakP>
        <UnitsTabMobile
          updateMobileHeaderScroll={updateMobileHeaderScroll}
          selectedThread={selectedThread}
          handleSelectThread={handleSelectThread}
          threadOptions={threadOptions}
          isSelectedThread={isSelectedThread}
          highlightedUnitCount={highlightedUnitCount}
          trackSelectYear={trackSelectYear}
          yearOptions={yearOptions}
          visibleMobileYearRefID={visibleMobileYearRefID}
        />
        <OakGrid>
          <OakGridArea data-test-id="filter-sidebar" $colSpan={[12, 3]}>
            <Box
              $mr={16}
              $mb={32}
              $display={["none", "block"]}
              data-testid="threads-filter-desktop"
            >
              <OakHeading tag={"h3"} $font={"heading-7"} $mb="space-between-xs">
                Highlight a thread
              </OakHeading>
              <OakP $mb="space-between-xs">
                Threads are groups of units across the curriculum that build a
                common body of knowledge
              </OakP>
              <RadioGroup
                aria-label="Highlight a thread"
                value={selectedThread ? selectedThread.slug : ""}
                onChange={handleSelectThread}
              >
                <Box $mv={16}>
                  <Radio
                    aria-label={"None highlighted"}
                    value={""}
                    data-testid={"no-threads-radio"}
                  >
                    None highlighted
                  </Radio>
                </Box>
                {threadOptions.map((threadOption) => {
                  const isSelected = isSelectedThread(threadOption);
                  const highlightedCount = highlightedUnitCount();
                  return (
                    <Box
                      $ba={1}
                      $background={isSelected ? "black" : "white"}
                      $borderColor={isSelected ? "black" : "grey40"}
                      $borderRadius={4}
                      $color={isSelected ? "white" : "black"}
                      $font={isSelected ? "heading-light-7" : "body-2"}
                      $ph={12}
                      $pt={12}
                      $mb={8}
                      key={threadOption.slug}
                    >
                      <Radio
                        aria-label={threadOption.title}
                        value={threadOption.slug}
                        data-testid={
                          isSelected ? "selected-thread-radio" : "thread-radio"
                        }
                      >
                        <OakSpan>
                          {threadOption.title}
                          <OakSpan aria-live="polite" aria-atomic="true">
                            {isSelected && (
                              <>
                                <br />
                                {highlightedCount}
                                {highlightedCount === 1 ? " unit " : " units "}
                                highlighted
                              </>
                            )}
                          </OakSpan>
                        </OakSpan>
                      </Radio>
                    </Box>
                  );
                })}
              </RadioGroup>
            </Box>
            <Box
              $mr={16}
              $mb={32}
              $display={["none", "block"]}
              data-testid="year-group-filter-desktop"
            >
              <OakHeading tag={"h3"} $font={"heading-7"} $mb="space-between-xs">
                Year group
              </OakHeading>
              <RadioGroup
                aria-label="Select a year group"
                value={selectedYear ?? ""}
                onChange={handleSelectYear}
              >
                <Box $mb={16}>
                  <Radio
                    aria-label="All"
                    value={""}
                    data-testid={"all-years-radio"}
                  >
                    All
                  </Radio>
                </Box>
                {yearOptions.map((yearOption) => (
                  <Box key={yearOption} $mb={16}>
                    <Radio
                      aria-label={`Year ${yearOption}`}
                      value={yearOption}
                      data-testid={"year-radio"}
                    >
                      Year {yearOption}
                    </Radio>
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          </OakGridArea>
          <CurriculumVisualiser
            unitData={unitData}
            yearSelection={yearSelection}
            selectedYear={selectedYear}
            examboardSlug={examboardSlug}
            yearData={yearData}
            handleSelectDomain={handleSelectDomain}
            handleSelectSubject={handleSelectSubject}
            handleSelectTier={handleSelectTier}
            handleSelectDiscipline={handleSelectDiscipline}
            duplicateUnitSlugs={duplicateUnitSlugs}
            mobileHeaderScrollOffset={mobileHeaderScrollOffset}
            setUnitData={setUnitData}
            selectedThread={selectedThread}
            setVisibleMobileYearRefID={setVisibleMobileYearRefID}
          />
        </OakGrid>
      </Box>
      <UnitTabBanner />
    </Box>
  );
};
export default UnitsTab;
