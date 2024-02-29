import React, { FC, useState, useRef, useEffect } from "react";
import { VisuallyHidden } from "react-aria";
import { OakGridArea, OakHeading, OakFlex } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Card from "@/components/SharedComponents/Card/Card";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import Button from "@/components/SharedComponents/Button/Button";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import UnitModal, {
  Lesson,
} from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

export type YearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    domains: Domain[];
    tiers: Tier[];
  };
};

export type Unit = CurriculumUnitsTabData["units"][number];

export interface Thread {
  title: string;
  slug: string;
  order: number;
}

export interface Subject {
  subject: string;
  subject_slug: string;
}

export interface Domain {
  domain: string;
  domain_id: number;
}

export interface Tier {
  tier: string;
  tier_slug: string;
}

export interface YearSelection {
  [key: string]: {
    subject?: Subject | null;
    domain?: Domain | null;
    tier?: Tier | null;
  };
}

type CurriculumVisualiserProps = {
  unitData: Unit | null;
  yearSelection: YearSelection;
  selectedThread: Thread | null;
  selectedYear: string | null;
  examboardSlug: string | null;
  yearData: YearData;
  handleSelectDomain: (year: string, domain: Domain) => void;
  handleSelectSubject: (year: string, subject: Subject) => void;
  handleSelectTier: (year: string, tier: Tier) => void;
  duplicateUnitSlugs: Set<string>;
  mobileHeaderScrollOffset?: number;
  setUnitData: (unit: Unit) => void;
  setVisibleMobileYearRefID: (refID: string) => void;
};

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

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  unitData,
  yearSelection,
  selectedYear,
  examboardSlug,
  yearData,
  handleSelectDomain,
  handleSelectSubject,
  handleSelectTier,
  duplicateUnitSlugs,
  mobileHeaderScrollOffset,
  setUnitData,
  selectedThread,
  setVisibleMobileYearRefID,
}) => {
  // Selection state helpers
  const [displayModal, setDisplayModal] = useState(false);
  const [unitOptionsAvailable, setUnitOptionsAvailable] =
    useState<boolean>(false);
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  const itemEls = useRef<(HTMLDivElement | null)[]>([]);

  /* Intersection observer to update year filter selection when 
  scrolling through the visualiser on mobile */
  useEffect(() => {
    const options = {
      root: null,
      threshold: [0.18],
    };

    const yearsLoaded = Object.keys(yearData).length;
    // only add IO once elements & data have loaded
    if (yearsLoaded > 0 && itemEls.current.length === yearsLoaded) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleMobileYearRefID(entry.target.id);
          }
        });
      }, options);
      itemEls.current.forEach((el) => io.observe(el as Element));
    }
  }, [setVisibleMobileYearRefID, yearData]);

  function isSelectedDomain(year: string, domain: Domain) {
    return yearSelection[year]?.domain?.domain_id === domain.domain_id;
  }

  function isSelectedSubject(year: string, subject: Subject) {
    return yearSelection[year]?.subject?.subject_slug === subject.subject_slug;
  }

  function isSelectedTier(year: string, tier: Tier) {
    return yearSelection[year]?.tier?.tier_slug === tier.tier_slug;
  }

  function isHighlightedUnit(unit: Unit) {
    if (!selectedThread) {
      return false;
    }
    return unit.threads.some((t) => t.slug === selectedThread.slug);
  }

  // Visibility helpers
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
  const handleOpenModal = (unitOptions: boolean, unit: Unit) => {
    setDisplayModal((prev) => !prev);
    setUnitOptionsAvailable(unitOptions);
    setUnitData({ ...unit });
    setCurrentUnitLessons(unit.lessons ?? []);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
    setCurrentUnitLessons([]);
  };

  return (
    <OakGridArea $colSpan={[12, 9]} data-testid="curriculum-visualiser">
      {yearData &&
        Object.keys(yearData)
          .filter((year) => !selectedYear || selectedYear === year)
          .map((year, index) => {
            const { units, childSubjects, domains, tiers } = yearData[
              year
            ] as YearData[string];
            return (
              <Box
                key={year}
                $background={"pink30"}
                $pt={32}
                $position={"relative"}
                $pl={30}
                $mb={32}
                $borderRadius={4}
                className="mobileYearDisplay"
                id={year}
                ref={(element) => (itemEls.current[index] = element)}
              >
                <AnchorTarget
                  $paddingTop={mobileHeaderScrollOffset}
                  id={`year-${year}`}
                />

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
                    {childSubjects.map((subject: Subject) => (
                      <Button
                        $mb={20}
                        $mr={20}
                        background={
                          isSelectedSubject(year, subject) ? "black" : "white"
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
                    {domains.map((domain: Domain) => (
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
                    {tiers.map((tier: Tier) => (
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
                    .filter((unit: Unit) => isVisibleUnit(year, unit))
                    .map((unit: Unit, index: number) => {
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
                                $zIndex={"neutral"}
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
                              background={isHighlighted ? "black" : undefined}
                              label="Unit info"
                              onClick={() => {
                                handleOpenModal(unitOptions, unit);
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
                    programmeSlug={createProgrammeSlug(unitData, examboardSlug)}
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
  );
};
export default CurriculumVisualiser;
