import { join } from "path";

import React, { FC, useState, useRef, useEffect } from "react";
import { VisuallyHidden } from "react-aria";
import {
  OakGridArea,
  OakHeading,
  OakFlex,
  OakP,
  OakIcon,
  OakSpan,
  OakRoundIcon,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import { createProgrammeSlug } from "../UnitsTab/UnitsTab";

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
    tiers: Tier[];
    subjectCategories: SubjectCategory[];
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

export interface SubjectCategory {
  id: number;
  title: string;
}

export interface Tier {
  tier: string;
  tier_slug: string;
}

export type Filter = Record<
  string,
  {
    subjectcategory_id?: SubjectCategory["id"] | null;
    subject_slug?: Subject["subject_slug"] | null;
    tier_slug?: Tier["tier_slug"] | null;
    thread_slug?: string | null;
  }
>;

export type CurriculumVisualiserProps = {
  unitData: Unit | null;
  filter: Filter;
  selectedThreadSlug: Thread["slug"] | null;
  selectedYear: string | null;
  examboardSlug: string | null;
  yearData: YearData;
  handleSelectSubject: (year: string, subject: Subject) => void;
  handleSelectTier: (year: string, tier: Tier) => void;
  handleSelectSubjectCategory: (
    year: string,
    subjectCategory: SubjectCategory,
  ) => void;
  mobileHeaderScrollOffset?: number;
  selectedUnitSlug?: string;
  basePath: string;
  onChangeVisibleMobileYearRefID: (id: string) => void;
};

function dedupUnits(units: Unit[]) {
  const unitLookup = new Set();
  return units.filter((unit) => {
    if (!unitLookup.has(unit.slug)) {
      unitLookup.add(unit.slug);
      return true;
    }
    return false;
  });
}

export function isVisibleUnit(year: string, filter: Filter, unit: Unit) {
  const s = filter[year];
  if (!s) {
    return false;
  }
  const filterBySubject =
    !s.subject_slug || s.subject_slug === unit.subject_slug;
  const filterBySubjectCategory =
    s.subjectcategory_id === -1 ||
    unit.subjectcategories?.findIndex((subjectCategory) => {
      return (
        subjectCategory.id === -1 || subjectCategory.id === s.subjectcategory_id
      );
    }) !== -1;
  const filterByTier =
    !s.tier_slug || !unit.tier_slug || s.tier_slug === unit.tier_slug;
  // Look for duplicates that don't have an examboard, tier or subject parent
  // (i.e. aren't handled by other filters)

  return filterBySubject && filterByTier && filterBySubjectCategory;
}

function isSelectedSubject(year: string, filter: Filter, subject: Subject) {
  return filter[year]?.subject_slug === subject.subject_slug;
}

function isSelectedTier(year: string, filter: Filter, tier: Tier) {
  return filter[year]?.tier_slug === tier.tier_slug;
}

function isSelectedSubjectCategory(
  year: string,
  filter: Filter,
  subjectCategory: SubjectCategory,
) {
  return filter[year]?.subjectcategory_id === subjectCategory.id;
}

function isHighlightedUnit(
  unit: Unit,
  selectedThreadSlug: Thread["slug"] | null,
) {
  if (!selectedThreadSlug) {
    return false;
  }
  return unit.threads.some((t) => t.slug === selectedThreadSlug);
}

function sortChildSubjects(subjects: Subject[]) {
  return [...subjects].sort((a, b) => {
    // Special logic we always want combined-science first.
    if (a.subject_slug === "combined-science") return -10;
    if (b.subject_slug === "combined-science") return 10;

    // Alphabetical
    if (a.subject_slug < b.subject_slug) return -1;
    if (a.subject_slug > b.subject_slug) return 1;
    return 0;
  });
}

// Function component

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  filter,
  selectedYear,
  examboardSlug,
  yearData,
  handleSelectSubject,
  handleSelectTier,
  handleSelectSubjectCategory,
  mobileHeaderScrollOffset,
  selectedThreadSlug,
  selectedUnitSlug,
  basePath,
  onChangeVisibleMobileYearRefID,
}) => {
  // Selection state helpers
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const visibleYears = useRef<Set<number>>(new Set());
  const visualiserRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  /* Intersection observer to update year filter selection when 
  scrolling through the visualiser on mobile */
  useEffect(() => {
    const options = { rootMargin: "-50% 0px 0px 0px" };
    const yearsLoaded = Object.keys(yearData).length;
    // All refs have been created for year groups & data is loaded
    if (yearsLoaded > 0 && itemEls.current.length === yearsLoaded) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const year = parseInt(entry.target.id, 10);
          if (entry.isIntersecting) {
            visibleYears.current.add(year);
          } else {
            visibleYears.current.delete(year);
          }
          if (visibleYears.current.size > 0) {
            const lowestYear = Math.min(...visibleYears.current).toString();
            onChangeVisibleMobileYearRefID(lowestYear);
          }
        });
      }, options);
      itemEls.current.forEach((el) => io.observe(el as Element));
      return () => {
        io.disconnect();
      };
    }
  }, [onChangeVisibleMobileYearRefID, yearData]);

  const units = Object.values(yearData).flatMap((obj) => obj.units);
  const selectedUnitData = units.find((unit) => unit.slug === selectedUnitSlug);

  const router = useRouter();

  const handleCloseModal = () => {
    router.replace(basePath, undefined, { scroll: false, shallow: true });
  };

  return (
    <OakGridArea
      id="content"
      $colSpan={[12, 9]}
      data-testid="curriculum-visualiser"
      ref={visualiserRef}
    >
      {yearData &&
        Object.keys(yearData)
          .filter((year) => !selectedYear || selectedYear === year)
          .map((year, index) => {
            const { units, childSubjects, tiers, subjectCategories } = yearData[
              year
            ] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };
            const filteredUnits = units.filter((unit: Unit) => {
              return isVisibleUnit(year, filter, unit);
            });
            const dedupedUnits = dedupUnits(filteredUnits);

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
                ref={ref}
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
                {childSubjects.length < 1 && subjectCategories?.length > 1 && (
                  <Box role="group" aria-label="Categories">
                    {subjectCategories.map((subjectCategory, index) => {
                      const isSelected = isSelectedSubjectCategory(
                        year,
                        filter,
                        subjectCategory,
                      );

                      return (
                        <Button
                          $mb={20}
                          $mr={20}
                          background={isSelected ? "black" : "white"}
                          key={index}
                          label={subjectCategory.title}
                          onClick={() =>
                            handleSelectSubjectCategory(year, subjectCategory)
                          }
                          size="small"
                          data-testid="subjectCategory-button"
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </Box>
                )}
                {childSubjects.length > 0 && (
                  <Box role="group" aria-label="Child Subjects">
                    {sortChildSubjects(childSubjects).map(
                      (subject: Subject) => {
                        const isSelected = isSelectedSubject(
                          year,
                          filter,
                          subject,
                        );

                        return (
                          <Button
                            $mb={20}
                            $mr={20}
                            background={isSelected ? "black" : "white"}
                            key={subject.subject_slug}
                            label={subject.subject}
                            onClick={() => handleSelectSubject(year, subject)}
                            size="small"
                            data-testid="subject-button"
                            aria-pressed={isSelected}
                          />
                        );
                      },
                    )}
                  </Box>
                )}
                {tiers.length > 0 && (
                  <Box role="group" aria-label="Tiers">
                    {tiers.map((tier: Tier) => {
                      const isSelected = isSelectedTier(year, filter, tier);
                      return (
                        <Button
                          $font={"heading-6"}
                          $mb={20}
                          $mr={24}
                          key={tier.tier_slug}
                          label={tier.tier}
                          onClick={() => handleSelectTier(year, tier)}
                          size="small"
                          variant="minimal"
                          isCurrent={isSelected}
                          currentStyles={["underline"]}
                          data-testid={`tier-button`}
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </Box>
                )}
                <OakFlex
                  $flexWrap={"wrap"}
                  $mt="space-between-xs"
                  data-testid="unit-cards"
                >
                  {dedupedUnits.map((unit: Unit, index: number) => {
                    const isHighlighted = isHighlightedUnit(
                      unit,
                      selectedThreadSlug,
                    );

                    const searchParamsStr = searchParams?.toString() ?? "";
                    const unitUrl =
                      join(basePath, unit.slug) +
                      `${!searchParamsStr ? "" : `?${searchParamsStr}`}`;

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
                          isHighlighted ? "highlighted-unit-card" : "unit-card"
                        }
                        $justifyContent={"space-between"}
                      >
                        <Link
                          href={unitUrl}
                          shallow={true}
                          scroll={false}
                          replace={true}
                          style={{ flex: 1, display: "inherit" }}
                        >
                          <OakFlex
                            $justifyContent={"space-between"}
                            $width={"100%"}
                            $flexDirection={"column"}
                            $flexGrow={1}
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
                              <OakP $font={"heading-7"} $mb="space-between-s">
                                {isHighlighted && (
                                  <VisuallyHidden>
                                    Highlighted:&nbsp;
                                  </VisuallyHidden>
                                )}
                                {unit.title}
                              </OakP>
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
                              <OakFlex
                                $font={"body-2-bold"}
                                $flexDirection={"row"}
                                $alignItems={"center"}
                                $justifyContent={"flex-end"}
                                $gap={"all-spacing-3"}
                              >
                                <OakSpan>Unit info</OakSpan>
                                {isHighlighted ? (
                                  <OakRoundIcon
                                    $height="all-spacing-7"
                                    $width="all-spacing-7"
                                    iconName="chevron-right"
                                    $background="white"
                                  />
                                ) : (
                                  <OakIcon
                                    $height="all-spacing-5"
                                    $width="all-spacing-5"
                                    iconName="chevron-right"
                                  />
                                )}
                              </OakFlex>
                            </OakFlex>
                          </OakFlex>
                        </Link>
                      </Card>
                    );
                  })}
                </OakFlex>
              </Box>
            );
          })}
      {selectedUnitData && (
        <UnitsTabSidebar
          displayModal={!!selectedUnitData}
          onClose={handleCloseModal}
          lessons={currentUnitLessons}
          programmeSlug={createProgrammeSlug(
            selectedUnitData,
            examboardSlug,
            filter[selectedUnitData.year]?.tier_slug ?? undefined,
          )}
          unitOptionsAvailable={
            (selectedUnitData?.unit_options ?? []).length > 0
          }
          unitSlug={selectedUnitData?.slug}
          unitVariantID={unitVariantID}
        >
          <UnitModal
            setCurrentUnitLessons={setCurrentUnitLessons}
            setUnitVariantID={setUnitVariantID}
            unitData={selectedUnitData}
            displayModal={!!selectedUnitData}
            setUnitOptionsAvailable={() => {}}
            unitOptionsAvailable={
              (selectedUnitData?.unit_options ?? []).length > 0
            }
            isHighlighted={
              selectedUnitData
                ? isHighlightedUnit(selectedUnitData, selectedThreadSlug)
                : false
            }
          />
        </UnitsTabSidebar>
      )}
    </OakGridArea>
  );
};
export default CurriculumVisualiser;
