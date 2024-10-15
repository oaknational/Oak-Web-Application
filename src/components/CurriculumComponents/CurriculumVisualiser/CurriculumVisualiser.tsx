import React, { FC, useState, useRef, useEffect } from "react";
import { VisuallyHidden } from "react-aria";
import { OakGridArea, OakHeading, OakFlex } from "@oaknational/oak-components";

import { createProgrammeSlug } from "../UnitsTab/UnitsTab";
import Alert from "../OakComponentsKitchen/Alert";

import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
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
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import { getUnitFeatures } from "@/utils/curriculum/features";

export type YearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    tiers: Tier[];
    subjectCategories: SubjectCategory[];
    labels: string[];
    groupAs: string | null;
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

export interface YearSelection {
  [key: string]: {
    subjectCategory?: SubjectCategory | null;
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
  handleSelectSubject: (year: string, subject: Subject) => void;
  handleSelectTier: (year: string, tier: Tier) => void;
  handleSelectSubjectCategory: (
    year: string,
    subjectCategory: SubjectCategory,
  ) => void;
  mobileHeaderScrollOffset?: number;
  setUnitData: (unit: Unit) => void;
  setVisibleMobileYearRefID: (refID: string) => void;
};

export function dedupUnits(units: Unit[]) {
  const unitLookup = new Set();
  return units.filter((unit) => {
    if (!unitLookup.has(unit.slug)) {
      unitLookup.add(unit.slug);
      return true;
    }
    return false;
  });
}

function isSelectedSubject(
  yearSelection: YearSelection,
  year: string,
  subject: Subject,
) {
  return yearSelection[year]?.subject?.subject_slug === subject.subject_slug;
}

function isSelectedTier(
  yearSelection: YearSelection,
  year: string,
  tier: Tier,
) {
  return yearSelection[year]?.tier?.tier_slug === tier.tier_slug;
}

function isSelectedSubjectCategory(
  yearSelection: YearSelection,
  year: string,
  subjectCategory: SubjectCategory,
) {
  return yearSelection[year]?.subjectCategory?.id === subjectCategory.id;
}

function isHighlightedUnit(unit: Unit, selectedThread: Thread | null) {
  if (!selectedThread) {
    return false;
  }
  return unit.threads.some((t) => t.slug === selectedThread.slug);
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
  unitData,
  yearSelection,
  selectedYear,
  examboardSlug,
  yearData,
  handleSelectSubject,
  handleSelectTier,
  handleSelectSubjectCategory,
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
  const visibleYears = useRef<Set<number>>(new Set());
  const visualiserRef = useRef<HTMLDivElement>(null);
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
            setVisibleMobileYearRefID(lowestYear);
          }
        });
      }, options);
      itemEls.current.forEach((el) => io.observe(el as Element));
      return () => {
        io.disconnect();
      };
    }
  }, [setVisibleMobileYearRefID, yearData]);

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

  // FIXME: This is kind of a HACK, currently units don't have tier_slug if
  // they are across multiple year. So we have to do this awkward step.
  const unitDataTier = unitData?.year
    ? yearSelection[unitData?.year]?.tier?.tier_slug
    : undefined;

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
          .sort((a, b) => {
            if (a === "all-years") {
              return -1;
            }
            const aNum = parseInt(a);
            const bNum = parseInt(b);
            return aNum - bNum;
          })
          .map((year, index) => {
            const { units, childSubjects, tiers, subjectCategories, labels } =
              yearData[year] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };
            const filteredUnits = units.filter((unit: Unit) =>
              isVisibleUnit(yearSelection, year, unit),
            );
            const dedupedUnits = dedupUnits(filteredUnits);

            const features = getUnitFeatures(units[0]);
            const yearTitle = getYearGroupTitle(
              yearData,
              year,
              getSuffixFromFeatures(features),
            );

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
                  $mb="space-between-s"
                  data-testid="year-heading"
                >
                  {yearTitle}
                </OakHeading>
                {labels.includes("swimming") && (
                  <Alert
                    $mb="space-between-s"
                    $mr="space-between-m2"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )}
                {childSubjects.length < 1 && subjectCategories?.length > 1 && (
                  <Box role="group" aria-label="Categories">
                    {subjectCategories.map((subjectCategory, index) => {
                      const isSelected = isSelectedSubjectCategory(
                        yearSelection,
                        year,
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
                          yearSelection,
                          year,
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
                      const isSelected = isSelectedTier(
                        yearSelection,
                        year,
                        tier,
                      );
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
                  $pt="inner-padding-s"
                  data-testid="unit-cards"
                >
                  {dedupedUnits.map((unit: Unit, index: number) => {
                    const isHighlighted = isHighlightedUnit(
                      unit,
                      selectedThread,
                    );
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
                          isHighlighted ? "highlighted-unit-card" : "unit-card"
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
                            data-testid={`unit-info-button-${unit.slug}${
                              unit.tier_slug ? `-${unit.tier_slug}` : ""
                            }`}
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
                </OakFlex>
              </Box>
            );
          })}
      {displayModal && (
        <UnitsTabSidebar
          displayModal={displayModal}
          onClose={handleCloseModal}
          lessons={currentUnitLessons}
          programmeSlug={createProgrammeSlug(
            unitData,
            examboardSlug,
            unitDataTier,
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
              unitData ? isHighlightedUnit(unitData, selectedThread) : false
            }
          />
        </UnitsTabSidebar>
      )}
    </OakGridArea>
  );
};
export default CurriculumVisualiser;
