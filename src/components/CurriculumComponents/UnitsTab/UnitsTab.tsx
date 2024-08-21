import React, { FC, ChangeEvent, useState, useEffect, useMemo } from "react";
import {
  OakGrid,
  OakGridArea,
  OakP,
  OakHeading,
  OakSpan,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import CurriculumVisualiser, {
  Thread,
  Subject,
  Tier,
  Unit,
  isVisibleUnit,
  Filter,
  SubjectCategory,
} from "../CurriculumVisualiser/CurriculumVisualiser";
import UnitsTabMobile from "../UnitsTabMobile/UnitsTabMobile";
import SkipLink from "../OakComponentsKitchen/SkipLink";
import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
import { RadioGroup, RadioButton } from "../OakComponentsKitchen/SimpleRadio";

import Box from "@/components/SharedComponents/Box";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { PhaseValueType } from "@/browser-lib/avo/Avo";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsTrackingData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[...slugs]";

// Types and interfaces

type UnitsTabProps = {
  trackingData: CurriculumUnitsTrackingData;
  formattedData: CurriculumUnitsFormattedData;
  selectedUnitSlug?: string;
  basePath: string;
};

export interface YearSelection {
  [key: string]: {
    subjectCategory?: SubjectCategory | null;
    subject?: Subject | null;
    tier?: Tier | null;
  };
}

export function createProgrammeSlug(
  unitData?: Unit | null,
  examboardSlug?: string | null,
  tierSlug?: string,
) {
  if (unitData?.keystage_slug === "ks4") {
    return `${unitData.subject_slug}-${unitData.phase_slug}-${
      unitData.keystage_slug
    }${tierSlug ? "-" + tierSlug : ""}${
      examboardSlug ? "-" + examboardSlug : ""
    }`;
  }
  return unitData
    ? `${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`
    : "";
}

// Function component

type GlobFilter = {
  thread_slug: string | null;
  year: string | null;
};

const UnitsTab: FC<UnitsTabProps> = ({
  trackingData,
  formattedData,
  selectedUnitSlug,
  basePath,
}) => {
  const router = useRouter();
  const [mobileHeaderScrollOffset, setMobileHeaderScrollOffset] =
    useState<number>(0);
  // Initialize constants
  const { yearData, threadOptions, yearOptions, initialYearSelection } =
    formattedData;
  const { examboardSlug } = trackingData;
  // Flattened duplicate slugs into array for getStaticProps, so casting back into a Set
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const [filter, setFilter] = useState<Filter>(initialYearSelection as Filter);

  // TODO: For testing...
  // useLayoutEffect(() => {
  //   setFilter({
  //     ...initialYearSelection,
  //     // TODO: Remove me!
  //     ["7"]: {
  //       ...initialYearSelection["7"],
  //       subjectcategory_id: 2
  //     }
  //    });
  // }, [initialYearSelection]);

  const [globFilter, setGlobFilter] = useState<GlobFilter>({
    thread_slug: null,
    year: null,
  });
  const [visibleMobileYearRefID, setVisibleMobileYearRefID] = useState<
    string | null
  >(null);

  const selectedYear = filter.year;

  const unitData = useMemo(() => {
    if (!selectedUnitSlug) return;
    return Object.values(formattedData.yearData)
      .flatMap((d) => d.units)
      .find((unit) => unit.slug === selectedUnitSlug);
  }, [formattedData, selectedUnitSlug]);

  useEffect(() => {
    if (selectedUnitSlug && !unitData) {
      console.log("no matching selector found");
      router.replace(basePath, undefined, { scroll: false, shallow: true });
    }
  }, [basePath, router, selectedUnitSlug, unitData]);

  const selectedThread = !globFilter.thread_slug
    ? undefined
    : threadOptions.find(
        (thread) => (thread.slug as string) === globFilter.thread_slug,
      );

  useEffect(() => {
    if (unitData && !isVisibleUnit(unitData.year, filter, unitData)) {
      console.log(
        "warning: current unit not visible by default (attempt to find valid filter)",
      );

      const targetFilters: Filter[] = [];
      const subjectcategoryIds = unitData.subjectcategories
        ? unitData.subjectcategories.map((s) => s.id)
        : [null];

      for (const subjectcategoryId of subjectcategoryIds) {
        targetFilters.push({
          ...filter,
          [unitData.year]: {
            subject_slug: unitData.subject_slug,
            subjectcategory_id: subjectcategoryId,
            tier_slug: unitData.tier_slug,
          },
        });
      }

      const validFilter = targetFilters.find((newFilter) =>
        isVisibleUnit(unitData.year, newFilter, unitData),
      );
      if (validFilter) {
        console.log("info: found unit with target selector");
        setFilter(validFilter);
      }
    }
  }, [unitData, filter]);

  function pushYearState(year: string, partial: Partial<Filter[string]>) {
    setFilter({
      ...filter,
      [year]: {
        ...filter[year],
        ...partial,
      },
    });
  }

  function pushGlobState(partial: Partial<GlobFilter>) {
    setGlobFilter({
      ...globFilter,
      ...partial,
    });
  }

  function handleSelectThread(slug: string): void {
    const thread = threadOptions.find((to) => to.slug === slug) ?? null;
    if (thread) {
      trackSelectThread(thread);
      pushGlobState({ thread_slug: thread?.slug });
    } else {
      pushGlobState({ thread_slug: null });
    }
  }

  function handleSelectYear(e: ChangeEvent<HTMLInputElement>): void {
    const year = e.target.value;
    trackSelectYear(year);
    pushGlobState({ year: year === "" ? null : year });
  }

  function handleSelectSubject(year: string, subject: Subject) {
    pushYearState(year, { subject_slug: subject.subject_slug });
  }

  function handleSelectSubjectCategory(
    year: string,
    subjectCategory: SubjectCategory,
  ) {
    pushYearState(year, { subjectcategory_id: subjectCategory.id });
  }

  function handleSelectTier(year: string, tier: Tier) {
    pushYearState(year, { tier_slug: tier.tier_slug });
  }

  // Visibility helpers

  function highlightedUnitCount(): number {
    let count = 0;
    Object.keys(yearData).forEach((year) => {
      const units = yearData[year]?.units;
      if (units && (!selectedYear || selectedYear === year)) {
        units.forEach((unit) => {
          if (
            isVisibleUnit(unit.year, filter, unit) &&
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
    if (!globFilter.thread_slug) {
      return false;
    }
    return unit.threads.some((t) => t.slug === globFilter.thread_slug);
  }

  function isSelectedThread(thread: Thread) {
    return globFilter.thread_slug === thread.slug;
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
          selectedThread={selectedThread ?? null}
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
            <Fieldset
              $mr={16}
              $mb={32}
              $display={["none", "block"]}
              data-testid="threads-filter-desktop"
            >
              <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
                Highlight a thread
              </FieldsetLegend>
              <OakP $mb="space-between-xs">
                Threads are groups of units across the curriculum that build a
                common body of knowledge
              </OakP>
              <RadioGroup
                name="thread"
                onChange={(e) => handleSelectThread(e.target.value)}
                value={globFilter.thread_slug ?? ""}
              >
                <SkipLink href="#content">Skip to units</SkipLink>
                <Box $mv={16}>
                  <RadioButton
                    aria-label={"None highlighted"}
                    value={""}
                    data-testid={"no-threads-radio"}
                  >
                    None highlighted
                  </RadioButton>
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
                      <RadioButton
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
                      </RadioButton>
                    </Box>
                  );
                })}
              </RadioGroup>
            </Fieldset>
            <Fieldset
              $mr={16}
              $mb={32}
              $display={["none", "block"]}
              data-testid="year-group-filter-desktop"
            >
              <FieldsetLegend $font={"heading-7"} $mb="space-between-xs">
                Year group
              </FieldsetLegend>
              <RadioGroup
                name="year"
                value={globFilter.year ?? ""}
                onChange={handleSelectYear}
              >
                <Box $mb={16}>
                  <RadioButton value={""} data-testid={"all-years-radio"}>
                    All
                  </RadioButton>
                </Box>
                {yearOptions.map((yearOption) => (
                  <Box key={yearOption} $mb={16}>
                    <RadioButton value={yearOption} data-testid={"year-radio"}>
                      Year {yearOption}
                    </RadioButton>
                  </Box>
                ))}
              </RadioGroup>
            </Fieldset>
          </OakGridArea>
          <CurriculumVisualiser
            basePath={basePath}
            selectedUnitSlug={selectedUnitSlug}
            unitData={unitData ?? null}
            filter={filter}
            selectedYear={globFilter.year}
            examboardSlug={examboardSlug}
            yearData={yearData}
            handleSelectSubjectCategory={handleSelectSubjectCategory}
            handleSelectSubject={handleSelectSubject}
            handleSelectTier={handleSelectTier}
            mobileHeaderScrollOffset={mobileHeaderScrollOffset}
            selectedThreadSlug={globFilter.thread_slug}
            onChangeVisibleMobileYearRefID={setVisibleMobileYearRefID}
          />
        </OakGrid>
      </Box>
      <UnitTabBanner />
    </Box>
  );
};
export default UnitsTab;
