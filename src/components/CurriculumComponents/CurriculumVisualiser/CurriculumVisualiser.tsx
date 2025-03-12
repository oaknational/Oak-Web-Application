import React, { FC, useState, useRef, useEffect } from "react";
import { OakHeading, OakFlex, OakBox } from "@oaknational/oak-components";
import styled from "styled-components";

import Alert from "../OakComponentsKitchen/Alert";
import FocusIndicator from "../OakComponentsKitchen/FocusIndicator";
import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";

import { areLessonsAvailable } from "@/utils/curriculum/lessons";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import Button from "@/components/SharedComponents/Button/Button";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import UnitModal from "@/components/CurriculumComponents/UnitModal/UnitModal";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { sortChildSubjects, sortYears } from "@/utils/curriculum/sorting";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import {
  Subject,
  SubjectCategory,
  Tier,
  Unit,
  YearData,
  YearSelection,
  Lesson,
} from "@/utils/curriculum/types";
import { CurriculumUnit } from "@/node-lib/curriculum-api-2023";

const UnitList = styled("ol")`
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const UnitListItem = styled("li")`
  margin: 0;
  liststyle: none;
  padding: 0;
  display: flex;
  width: 240px;
  flex-grow: 1;
  position: relative;
`;

type CurriculumVisualiserProps = {
  unitData: Unit | null;
  yearSelection: YearSelection;
  selectedThread: string | null;
  selectedYear: string | null;
  ks4OptionSlug?: string | null;
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

function isHighlightedUnit(unit: Unit, selectedThread: string | null) {
  if (!selectedThread) {
    return false;
  }
  return unit.threads.some((t) => t.slug === selectedThread);
}

const StyledButton = styled("button")`
  all: unset;
  color: inherit;
  cursor: pointer;
  padding: 12px;

  &:hover:not([aria-pressed="true"]) {
    background: #f2f2f2;
  }
`;

// Function component

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  unitData,
  yearSelection,
  selectedYear,
  ks4OptionSlug,
  yearData,
  handleSelectSubject,
  handleSelectTier,
  handleSelectSubjectCategory,
  mobileHeaderScrollOffset,
  setUnitData,
  selectedThread,
  setVisibleMobileYearRefID,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  // Selection state helpers
  const [displayModal, setDisplayModal] = useState(false);
  const [unitOptionsAvailable, setUnitOptionsAvailable] =
    useState<boolean>(false);
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);

  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  /* Intersection observer to update year filter selection when
  scrolling through the visualiser on mobile */
  useEffect(() => {
    const options = { rootMargin: "-50% 0px 0px 0px" };
    const yearsLoaded = Object.keys(yearData).length;
    // All refs have been created for year groups & data is loaded
    if (yearsLoaded > 0 && itemEls.current.length === yearsLoaded) {
      // const io = new IntersectionObserver(, options);
      const io = new IntersectionObserver(
        anchorIntersectionObserver(setVisibleMobileYearRefID),
        options,
      );

      itemEls.current.forEach((el) => {
        if (el) {
          io.observe(el);
        }
      });
      return () => {
        io.disconnect();
      };
    }
  }, [setVisibleMobileYearRefID, yearData]);

  const trackModalOpenEvent = (
    unit: CurriculumUnit,
    isHighlighted: boolean,
    isOpen: boolean,
  ) => {
    if (isOpen && unit) {
      track.unitOverviewAccessed({
        unitName: unit.title,
        unitSlug: unit.slug,
        subjectTitle: unit.subject,
        subjectSlug: unit.subject_slug,
        yearGroupName: `Year ${unit.year}`,
        yearGroupSlug: unit.year,
        threadTitle: selectedThread,
        threadSlug: selectedThread,
        platform: "owa",
        product: "curriculum visualiser",
        engagementIntent: "use",
        componentType: "unit_info_button",
        eventVersion: "2.0.0",
        analyticsUseCase,
        unitHighlighted: isHighlighted, // bool
        isUnitPublished: areLessonsAvailable(unit.lessons), // bool
      });
    }
  };

  const handleOpenModal = (
    unitOptions: boolean,
    unit: Unit,
    isHighlighted: boolean,
  ) => {
    const newDisplayModal = !displayModal;
    setDisplayModal(newDisplayModal);
    trackModalOpenEvent(unit, isHighlighted, newDisplayModal);
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
    <OakBox id="content" data-testid="curriculum-visualiser">
      {yearData &&
        Object.keys(yearData)
          .filter((year) => !selectedYear || selectedYear === year)
          .sort(sortYears)
          .map((year, index) => {
            const {
              units,
              childSubjects,
              tiers,
              subjectCategories,
              isSwimming,
            } = yearData[year] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };

            const filteredUnits = units.filter((unit: Unit) =>
              isVisibleUnit(yearSelection, year, unit),
            );
            const dedupedUnits = dedupUnits(filteredUnits);

            const actions = units[0]?.actions;

            const yearTitle = getYearGroupTitle(
              yearData,
              year,
              getSuffixFromFeatures(actions),
            );

            return (
              <OakBox
                key={year}
                $background={"pink30"}
                $pa={"inner-padding-xl2"}
                $position={"relative"}
                $mb={"space-between-m2"}
                $borderRadius={"border-radius-s"}
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
                {isSwimming && (
                  <Alert
                    $mb="space-between-s"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )}
                {childSubjects.length < 1 && subjectCategories?.length > 1 && (
                  <OakBox role="group" aria-label="Categories">
                    {subjectCategories.map((subjectCategory, index) => {
                      const isSelected = isSelectedSubjectCategory(
                        yearSelection,
                        year,
                        subjectCategory,
                      );

                      return (
                        <FocusIndicator
                          key={index}
                          $display={"inline-block"}
                          $mb="space-between-ssx"
                          $mr="space-between-ssx"
                          $background={isSelected ? "black" : "white"}
                          $color={isSelected ? "white" : "black"}
                          $borderRadius={"border-radius-s"}
                          $font="heading-7"
                          disableMouseHover={isSelected}
                        >
                          <StyledButton
                            data-testid="subjectCategory-button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              handleSelectSubjectCategory(year, subjectCategory)
                            }
                          >
                            {subjectCategory.title}
                          </StyledButton>
                        </FocusIndicator>
                      );
                    })}
                  </OakBox>
                )}
                {childSubjects.length > 0 && (
                  <OakBox
                    role="group"
                    aria-label="Child Subjects"
                    $mb="space-between-ssx"
                  >
                    {[...childSubjects]
                      .sort(sortChildSubjects)
                      .map((subject: Subject) => {
                        const isSelected = isSelectedSubject(
                          yearSelection,
                          year,
                          subject,
                        );

                        return (
                          <FocusIndicator
                            key={`${subject.subject_slug}-${year}`}
                            $display={"inline-block"}
                            $mb="space-between-ssx"
                            $mr="space-between-ssx"
                            $background={isSelected ? "black" : "white"}
                            $color={isSelected ? "white" : "black"}
                            $borderRadius={"border-radius-s"}
                            $font="heading-7"
                            disableMouseHover={isSelected}
                          >
                            <StyledButton
                              data-testid="subject-button"
                              aria-pressed={isSelected}
                              onClick={() => handleSelectSubject(year, subject)}
                            >
                              {subject.subject}
                            </StyledButton>
                          </FocusIndicator>
                        );
                      })}
                  </OakBox>
                )}
                {tiers.length > 0 && (
                  <OakBox role="group" aria-label="Tiers">
                    {tiers.map((tier: Tier) => {
                      const isSelected = isSelectedTier(
                        yearSelection,
                        year,
                        tier,
                      );
                      return (
                        <Button
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
                  </OakBox>
                )}
                <OakFlex
                  $flexWrap={"wrap"}
                  $pt="inner-padding-s"
                  data-testid="unit-cards"
                  $gap={"all-spacing-4"}
                  // TODO: Remove hack
                  style={{
                    marginBottom: "-1rem",
                  }}
                >
                  <UnitList role="list">
                    {dedupedUnits.map((unit: Unit, index: number) => {
                      const isHighlighted = isHighlightedUnit(
                        unit,
                        selectedThread,
                      );
                      const unitOptions = unit.unit_options.length >= 1;

                      return (
                        <UnitListItem>
                          <CurriculumUnitCard
                            unit={unit}
                            key={unit.slug + index}
                            index={index}
                            isHighlighted={isHighlighted}
                            onClick={() => {
                              handleOpenModal(unitOptions, unit, isHighlighted);
                            }}
                          />
                        </UnitListItem>
                      );
                    })}
                    {/* Empty tiles for correct flex wrapping */}
                    {Array(3)
                      .fill(true)
                      .map(() => {
                        return (
                          <OakFlex
                            $width={"all-spacing-19"}
                            $flexGrow={1}
                            $position={"relative"}
                          />
                        );
                      })}
                  </UnitList>
                </OakFlex>
              </OakBox>
            );
          })}
      {displayModal && (
        <UnitsTabSidebar
          displayModal={displayModal}
          onClose={handleCloseModal}
          lessons={currentUnitLessons}
          programmeSlug={createTeacherProgrammeSlug(
            unitData,
            ks4OptionSlug,
            unitDataTier,
            unitData?.pathway_slug ?? undefined,
          )}
          unitOptionsAvailable={unitOptionsAvailable}
          unitSlug={unitData?.slug}
          unitData={unitData}
          unitVariantID={unitVariantID}
        >
          <UnitModal
            setCurrentUnitLessons={setCurrentUnitLessons}
            setUnitVariantID={setUnitVariantID}
            unitData={unitData}
            yearData={yearData}
            displayModal={displayModal}
            setUnitOptionsAvailable={setUnitOptionsAvailable}
            unitOptionsAvailable={unitOptionsAvailable}
            selectedThread={selectedThread}
          />
        </UnitsTabSidebar>
      )}
    </OakBox>
  );
};
export default CurriculumVisualiser;
