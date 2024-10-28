import React, { FC, useState, useRef, useEffect } from "react";
import { VisuallyHidden } from "react-aria";
import {
  OakHeading,
  OakFlex,
  OakIcon,
  OakTypography,
  OakBox,
  OakSpan,
} from "@oaknational/oak-components";
import styled from "styled-components";

import Alert from "../OakComponentsKitchen/Alert";
import FocusIndicator from "../OakComponentsKitchen/FocusIndicator";

import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import Button from "@/components/SharedComponents/Button/Button";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import UnitModal, {
  Lesson,
} from "@/components/CurriculumComponents/UnitModal/UnitModal";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import { getUnitFeatures } from "@/utils/curriculum/features";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { sortChildSubjects, sortYears } from "@/utils/curriculum/sorting";
import { createProgrammeSlug } from "@/utils/curriculum/slugs";
import {
  Subject,
  SubjectCategory,
  Tier,
  Unit,
  YearData,
  YearSelection,
} from "@/utils/curriculum/types";

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

const UnstyledButton = styled("button")`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  display: block;
  text-align: left;
  outline: none;
  cursor: pointer;
`;

type CurriculumVisualiserProps = {
  unitData: Unit | null;
  yearSelection: YearSelection;
  selectedThread: string | null;
  selectedYear: string | null;
  ks4OptionSlug: string | null;
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

      itemEls.current.forEach((el) => io.observe(el as Element));
      return () => {
        io.disconnect();
      };
    }
  }, [setVisibleMobileYearRefID, yearData]);

  const trackModalOpenEvent = (isOpen: boolean, unitData: Unit) => {
    if (isOpen && unitData) {
      track.unitInformationViewed({
        unitName: unitData.title,
        unitSlug: unitData.slug,
        subjectTitle: unitData.subject,
        subjectSlug: unitData.subject_slug,
        yearGroupName: unitData.year,
        yearGroupSlug: unitData.year,
        unitHighlighted: isHighlightedUnit(unitData, selectedThread),
        analyticsUseCase: analyticsUseCase,
      });
    }
  };

  const handleOpenModal = (unitOptions: boolean, unit: Unit) => {
    const newDisplayModal = !displayModal;
    setDisplayModal(newDisplayModal);
    trackModalOpenEvent(newDisplayModal, unit);
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
                {labels.includes("swimming") && (
                  <Alert
                    $mb="space-between-s"
                    $mr="space-between-m2"
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
                  <OakBox role="group" aria-label="Child Subjects">
                    {[...childSubjects]
                      .sort(sortChildSubjects)
                      .map((subject: Subject) => {
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
                          <FocusIndicator
                            key={unit.slug + index}
                            $height={"100%"}
                            $width={"100%"}
                            $borderRadius={"border-radius-m"}
                            $overflow={"hidden"}
                            $background={isHighlighted ? "black" : "white"}
                            disableMouseHover={isHighlighted}
                          >
                            <UnstyledButton
                              onClick={() => {
                                handleOpenModal(unitOptions, unit);
                              }}
                            >
                              <OakFlex
                                $pv={"inner-padding-s"}
                                $ph={"inner-padding-m"}
                                $height={"100%"}
                                $width={"100%"}
                                $color={isHighlighted ? "white" : "black"}
                                data-testid={
                                  isHighlighted
                                    ? "highlighted-unit-card"
                                    : "unit-card"
                                }
                                $flexDirection={"column"}
                              >
                                <OakBox>
                                  <OutlineHeading
                                    tag={"div"}
                                    $font={"heading-5"}
                                    $fontSize={24}
                                    $mb={12}
                                  >
                                    <span aria-hidden={true}>{index + 1}</span>
                                  </OutlineHeading>
                                  <OakSpan $font={"heading-7"}>
                                    {unit.title}
                                  </OakSpan>
                                  {unit.unit_options.length > 1 && (
                                    <OakBox
                                      $mt={"space-between-xs"}
                                      $mb={"space-between-m"}
                                      $zIndex={"neutral"}
                                      data-testid="options-tag"
                                      $position={"relative"}
                                    >
                                      <TagFunctional
                                        color="lavender"
                                        text={`${unit.unit_options.length} unit options`}
                                      />
                                    </OakBox>
                                  )}
                                </OakBox>

                                <OakFlex
                                  $flexDirection={"row"}
                                  $justifyContent={"flex-end"}
                                  $mt={"space-between-s"}
                                  $flexGrow={1}
                                  $alignItems={"flex-end"}
                                >
                                  <OakFlex
                                    $alignItems={"center"}
                                    $gap={"space-between-sssx"}
                                  >
                                    <OakTypography $font={"heading-7"}>
                                      Unit info
                                    </OakTypography>

                                    <OakIcon
                                      $width="all-spacing-6"
                                      $height="all-spacing-6"
                                      $colorFilter={
                                        isHighlighted ? "white" : "black"
                                      }
                                      alt=""
                                      iconName="chevron-right"
                                    />
                                  </OakFlex>
                                </OakFlex>
                                {isHighlighted && (
                                  <VisuallyHidden>
                                    &nbsp;(highlighted)
                                  </VisuallyHidden>
                                )}
                              </OakFlex>
                            </UnstyledButton>
                          </FocusIndicator>
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
          programmeSlug={createProgrammeSlug(
            unitData,
            ks4OptionSlug,
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
            yearData={yearData}
            displayModal={displayModal}
            setUnitOptionsAvailable={setUnitOptionsAvailable}
            unitOptionsAvailable={unitOptionsAvailable}
          />
        </UnitsTabSidebar>
      )}
    </OakBox>
  );
};
export default CurriculumVisualiser;
