import React, { FC, useState, useRef, useEffect } from "react";
import { VisuallyHidden } from "react-aria";
import {
  OakGrid,
  OakGridArea,
  OakP,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Card from "@/components/SharedComponents/Card/Card";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/SharedComponents/Icon";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import Button from "@/components/SharedComponents/Button/Button";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Radio from "@/components/SharedComponents/RadioButtons/Radio";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";
import UnitModal, {
  Lesson,
} from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import UnitTabBanner from "@/components/CurriculumComponents/UnitTabBanner";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { PhaseValueType } from "@/browser-lib/avo/Avo";

// Types and interfaces

type UnitsTabProps = {
  data: CurriculumUnitsTabData;
  examboardSlug: string | null;
};

export type Unit = CurriculumUnitsTabData["units"][number];

export interface Thread {
  title: string;
  slug: string;
  order: number;
}

interface Subject {
  subject: string;
  subject_slug: string;
}

interface Domain {
  domain: string;
  domain_id: number;
}

interface Tier {
  tier: string;
  tier_slug: string;
}

interface YearSelection {
  [key: string]: {
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
// Initialize data structure for displaying units by year
let yearData: {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    domains: Domain[];
    tiers: Tier[];
  };
} = {};
let threadOptions: Thread[] = [];
let yearOptions: string[] = [];
const unitSlugs = new Set<string>();
const duplicateUnitSlugs = new Set<string>();

// Function component

const UnitsTab: FC<UnitsTabProps> = ({ data, examboardSlug }) => {
  // Initialize constants
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const [displayModal, setDisplayModal] = useState(false);
  const [unitData, setUnitData] = useState<Unit | null>(null);
  const [unitOptionsAvailable, setUnitOptionsAvailable] =
    useState<boolean>(false);
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  const [yearSelection, setYearSelection] = useState<YearSelection>({});
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Put data formatting code in useEffect to avoid unnecessary re-renders
  useEffect(() => {
    yearData = {};
    threadOptions = [];
    yearOptions = [];
    unitSlugs.clear();
    duplicateUnitSlugs.clear();

    data.units.forEach((unit) => {
      // Populate years object

      if (yearOptions.every((yo) => yo !== unit.year)) {
        yearOptions.push(unit.year);
      }

      // Populate threads object

      unit.threads.forEach((thread) => {
        if (threadOptions.every((to: Thread) => to.slug !== thread.slug)) {
          threadOptions.push(thread);
        }
      });

      // Check if the yearData object has an entry for the unit's year
      // If not, initialize it with default values

      let currentYearData = yearData[unit.year];
      if (!currentYearData) {
        currentYearData = {
          units: [],
          childSubjects: [],
          domains: [],
          tiers: [],
        };
        yearData[unit.year] = currentYearData;
      }

      // Add the current unit

      currentYearData.units.push(unit);

      // Populate list of child subject filter values

      if (
        unit.subject_parent &&
        unit.subject_parent_slug &&
        currentYearData.childSubjects.every(
          (c) => c.subject_slug !== unit.subject_slug,
        )
      ) {
        currentYearData.childSubjects.push({
          subject: unit.subject,
          subject_slug: unit.subject_slug,
        });
      }

      // Populate list of domain filter values

      if (
        unit.domain &&
        unit.domain_id &&
        currentYearData.domains.every((d) => d.domain_id !== unit.domain_id)
      ) {
        currentYearData.domains.push({
          domain: unit.domain,
          domain_id: unit.domain_id,
        });
      }

      // Populate list of tier filter values

      if (
        unit.tier &&
        unit.tier_slug &&
        currentYearData.tiers.every((t) => t.tier_slug !== unit.tier_slug)
      ) {
        currentYearData.tiers.push({
          tier: unit.tier,
          tier_slug: unit.tier_slug,
        });
      }

      // Check for duplicate unit slugs

      if (unitSlugs.has(unit.slug)) {
        duplicateUnitSlugs.add(unit.slug);
      } else {
        unitSlugs.add(unit.slug);
      }
    });

    // Sort year data

    yearOptions.sort((a, b) => Number(a) - Number(b));

    // Sort threads

    const threadOrders = new Set(threadOptions.map((to) => to.order));
    if (threadOptions.length > threadOrders.size) {
      // In secondary science multiple threads can have the same order value due
      // to multiple subjects (eg biology, chemistry, physics) being shown, so
      // if orders are not unique, sort alphabetically by slug

      threadOptions.sort((a, b) => a.slug.localeCompare(b.slug));
    } else {
      // If orders are unique, use them to sort

      threadOptions.sort((a, b) => a.order - b.order);
    }

    // Set up year-specific filters (domains, child subjects, tiers):
    // populate options and select defaults

    const initialYearSelection = {} as YearSelection;
    Object.keys(yearData).forEach((year) => {
      const filters = yearData[year];
      if (!filters) {
        throw new Error("year filters missing");
      }
      if (filters.domains.length > 0) {
        filters.domains.sort((a, b) => a.domain_id - b.domain_id);
        filters.domains.unshift({
          domain: "All",
          domain_id: 0,
        });
      }
      filters.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
      initialYearSelection[year] = {
        subject:
          filters.childSubjects.find(
            (s) => s.subject_slug === "combined-science",
          ) ?? null,
        domain: filters.domains.length ? filters.domains[0] : null,
        tier: filters.tiers.length ? filters.tiers[0] : null,
      };
    });

    setYearSelection(initialYearSelection);
    setSelectedThread(null);
    setSelectedYear(null);
  }, [data]);

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

  function handleSelectTier(year: string, tier: Tier) {
    const selection = { ...yearSelection[year] };
    selection.tier = tier;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  // Selection state helpers

  function isSelectedDomain(year: string, domain: Domain) {
    return yearSelection[year]?.domain?.domain_id === domain.domain_id;
  }

  function isSelectedSubject(year: string, subject: Subject) {
    return yearSelection[year]?.subject?.subject_slug === subject.subject_slug;
  }

  function isSelectedTier(year: string, tier: Tier) {
    return yearSelection[year]?.tier?.tier_slug === tier.tier_slug;
  }

  // Visibility helpers

  function highlightedUnitCount(): number {
    let count = 0;
    Object.keys(yearData).forEach((year) => {
      const units = yearData[year]?.units;
      if (units && (!selectedYear || selectedYear === year)) {
        units.forEach((unit) => {
          if (isVisibleUnit(year, unit) && isHighlightedUnit(unit)) {
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

  function isVisibleUnit(year: string, unit: Unit) {
    const s = yearSelection[year];
    if (!s) {
      return false;
    }
    const filterBySubject =
      !s.subject || s.subject.subject_slug === unit.subject_slug;
    const filterByDomain =
      !s.domain ||
      s.domain.domain_id === 0 ||
      s.domain.domain_id === unit.domain_id;
    const filterByTier =
      !s.tier || !unit.tier_slug || s.tier?.tier_slug === unit.tier_slug;

    // Look for duplicates that don't have an examboard, tier or subject parent
    // (i.e. aren't handled by other filters)

    const isDuplicate =
      unit.examboard === null &&
      unit.tier === null &&
      unit.subject_parent === null &&
      duplicateUnitSlugs.has(unit.slug);
    return filterBySubject && filterByDomain && filterByTier && !isDuplicate;
  }

  // Modal handlers

  const handleOpenModal = () => {
    setDisplayModal((prev) => !prev);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
    setCurrentUnitLessons([]);
  };

  // Analytics handlers

  function trackSelectThread(thread: Thread): void {
    if (data.units[0]) {
      const { subject, phase_slug, subject_slug: subjectSlug } = data.units[0];
      track.curriculumThreadHighlighted({
        subjectTitle: subject,
        subjectSlug: subjectSlug,
        threadTitle: thread.title,
        threadSlug: thread.slug,
        phase: phase_slug as PhaseValueType,
        order: thread.order,
        analyticsUseCase: analyticsUseCase,
      });
    }
  }

  function trackSelectYear(year: string): void {
    if (data.units[0]) {
      track.yearGroupSelected({
        yearGroupName: year,
        yearGroupSlug: year,
        subjectTitle: data.units[0].subject,
        subjectSlug: data.units[0].subject_slug,
        analyticsUseCase: analyticsUseCase,
      });
    }
  }

  return (
    <Box>
      <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
        <OakHeading
          tag="h2"
          $mb="space-between-m"
          $font={["heading-5", "heading-4"]}
        >
          Unit sequence
        </OakHeading>
        <Card $background={"lemon30"} $pa={0} $pl={96} $mb={[16, 48]}>
          <Box
            $background={"lemon"}
            $height={"100%"}
            $left={0}
            $position={"absolute"}
            $top={0}
            $width={[64, 96]}
            $textAlign={"center"}
          >
            <Icon
              name={"bell"}
              size={[48]}
              $position={"relative"}
              $transform={"translateY(-50%)"}
              $top={"50%"}
            />
          </Box>
          <Box $pa={20}>
            <OakHeading
              tag="h3"
              $font={"heading-7"}
              $mb="space-between-xs"
              data-testid="units-heading"
            >
              Introducing our new curriculum sequence for 2023/2024!
            </OakHeading>
            <OakP>
              Units that make up our curricula are fully sequenced, and aligned
              to the national curriculum.
            </OakP>
          </Box>
        </Card>
        <OakGrid>
          <OakGridArea $colSpan={[12, 3]}>
            <Box $mr={16} $mb={32}>
              <OakHeading tag={"h4"} $font={"heading-7"} $mb="space-between-xs">
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
                        {threadOption.title}
                        {isSelected && (
                          <>
                            <br />
                            {highlightedCount}
                            {highlightedCount === 1 ? " unit " : " units "}
                            highlighted
                          </>
                        )}
                      </Radio>
                    </Box>
                  );
                })}
              </RadioGroup>
            </Box>
            <Box $mr={16} $mb={32}>
              <OakHeading tag={"h4"} $font={"heading-7"} $mb="space-between-xs">
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
          <OakGridArea $colSpan={[12, 9]}>
            {Object.keys(yearData)
              .filter((year) => !selectedYear || selectedYear === year)
              .map((year) => {
                const { units, childSubjects, domains, tiers } = yearData[
                  year
                ] as (typeof yearData)[string];
                return (
                  <Box
                    key={year}
                    $background={"pink30"}
                    $pt={32}
                    $pl={30}
                    $mb={32}
                    $borderRadius={4}
                  >
                    <OakHeading
                      tag="h3"
                      $font={["heading-6", "heading-5"]}
                      $mb="space-between-m2"
                      data-testid="year-heading"
                    >
                      Year {year}
                    </OakHeading>
                    {childSubjects.length > 0 && (
                      <Box>
                        {childSubjects.map((subject) => (
                          <Button
                            $mb={20}
                            $mr={20}
                            background={
                              isSelectedSubject(year, subject)
                                ? "black"
                                : "white"
                            }
                            key={subject.subject_slug}
                            label={subject.subject}
                            onClick={() => handleSelectSubject(year, subject)}
                            size="small"
                            data-testid="subject-button"
                          />
                        ))}
                      </Box>
                    )}
                    {domains.length > 0 && (
                      <Box>
                        {domains.map((domain) => (
                          <Button
                            $mb={20}
                            $mr={20}
                            background={
                              isSelectedDomain(year, domain) ? "black" : "white"
                            }
                            key={domain.domain_id}
                            label={domain.domain}
                            onClick={() => handleSelectDomain(year, domain)}
                            size="small"
                            data-testid="domain-button"
                          />
                        ))}
                      </Box>
                    )}
                    {tiers.length > 0 && (
                      <Box>
                        {tiers.map((tier) => (
                          <Button
                            $font={"heading-6"}
                            $mb={20}
                            $mr={24}
                            key={tier.tier_slug}
                            label={tier.tier}
                            onClick={() => handleSelectTier(year, tier)}
                            size="small"
                            variant="minimal"
                            isCurrent={isSelectedTier(year, tier)}
                            currentStyles={["underline"]}
                            data-testid="tier-button"
                          />
                        ))}
                      </Box>
                    )}
                    <OakFlex
                      $flexWrap={"wrap"}
                      $mt="space-between-xs"
                      data-testid="unit-cards"
                    >
                      {units
                        .filter((unit) => isVisibleUnit(year, unit))
                        .map((unit, index) => {
                          const isHighlighted = isHighlightedUnit(unit);
                          const unitOptions = unit.unit_options.length >= 1;

                          return (
                            <Card
                              key={unit.slug + index}
                              $background={isHighlighted ? "black" : "white"}
                              $color={isHighlighted ? "white" : "black"}
                              $flexGrow={"unset"}
                              $mb={32}
                              $mr={28}
                              $position={"relative"}
                              $width={[
                                "100%",
                                "calc(50% - 28px)",
                                "calc(33% - 26px)",
                              ]}
                              data-testid={
                                isHighlighted
                                  ? "highlighted-unit-card"
                                  : "unit-card"
                              }
                              $justifyContent={"space-between"}
                            >
                              <Box>
                                <OutlineHeading
                                  tag={"div"}
                                  $font={"heading-5"}
                                  $fontSize={24}
                                  $mb={12}
                                >
                                  {index + 1}
                                </OutlineHeading>
                                <OakHeading
                                  tag={"h4"}
                                  $font={"heading-7"}
                                  $mb="space-between-s"
                                >
                                  {isHighlighted && (
                                    <VisuallyHidden>
                                      Highlighted:&nbsp;
                                    </VisuallyHidden>
                                  )}
                                  {unit.title}
                                </OakHeading>
                                {unit.unit_options.length > 1 && (
                                  <Box
                                    $mt={12}
                                    $mb={20}
                                    $zIndex={"inFront"}
                                    data-testid="options-tag"
                                    $position={"relative"}
                                  >
                                    <TagFunctional
                                      color="lavender"
                                      text={`${unit.unit_options.length} unit options`}
                                    />
                                  </Box>
                                )}
                                <BrushBorders
                                  color={isHighlighted ? "black" : "white"}
                                />
                              </Box>

                              <OakFlex
                                $flexDirection={"row"}
                                $justifyContent={"flex-end"}
                              >
                                <Button
                                  icon="chevron-right"
                                  $iconPosition="trailing"
                                  data-testid="unit-modal-button"
                                  variant={isHighlighted ? "brush" : "minimal"}
                                  background={
                                    isHighlighted ? "black" : undefined
                                  }
                                  label="Unit info"
                                  onClick={() => {
                                    handleOpenModal();
                                    setUnitOptionsAvailable(unitOptions);
                                    setUnitData({ ...unit });
                                    setCurrentUnitLessons(unit.lessons ?? []);
                                  }}
                                  ref={modalButtonRef}
                                />
                              </OakFlex>
                            </Card>
                          );
                        })}
                      <UnitsTabSidebar
                        displayModal={displayModal}
                        onClose={handleCloseModal}
                        lessons={currentUnitLessons}
                        programmeSlug={createProgrammeSlug(
                          unitData,
                          examboardSlug,
                        )}
                        unitOptionsAvailable={unitOptionsAvailable}
                        unitSlug={unitData?.slug}
                        unitVariantID={unitVariantID}
                      >
                        <UnitModal
                          setCurrentUnitLessons={setCurrentUnitLessons}
                          setUnitVariantID={setUnitVariantID}
                          unitData={unitData}
                          displayModal={displayModal}
                          setUnitOptionsAvailable={setUnitOptionsAvailable}
                          unitOptionsAvailable={unitOptionsAvailable}
                          isHighlighted={
                            unitData ? isHighlightedUnit(unitData) : false
                          }
                        />
                      </UnitsTabSidebar>
                    </OakFlex>
                  </Box>
                );
              })}
          </OakGridArea>
        </OakGrid>
      </Box>
      <UnitTabBanner />
    </Box>
  );
};
export default UnitsTab;
