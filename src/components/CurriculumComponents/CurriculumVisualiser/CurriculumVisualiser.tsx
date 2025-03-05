import React, { FC, useState, useRef, useEffect } from "react";
import { OakHeading, OakFlex, OakBox, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

import Alert from "../OakComponentsKitchen/Alert";
import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";

import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import UnitModal, {
  Lesson,
} from "@/components/CurriculumComponents/UnitModal/UnitModal";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
  getYearSubheadingText,
} from "@/utils/curriculum/formatting";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { sortYears } from "@/utils/curriculum/sorting";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { CurriculumFilters, Unit, YearData } from "@/utils/curriculum/types";

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
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
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

function isHighlightedUnit(unit: Unit, selectedThreads: string[] | null) {
  if (!selectedThreads || selectedThreads?.length < 1) {
    return false;
  }
  return unit.threads.some((t) => {
    return selectedThreads.includes(t.slug);
  });
}

function getSubjectCategoryMessage(
  yearData: YearData,
  currentYear: string,
  subjectCategories: string[],
): string | null {
  if (subjectCategories.length === 0) return null;

  const years = Object.keys(yearData).sort(sortYears);
  const currentIndex = years.indexOf(currentYear);
  if (currentIndex === -1) return null;

  // Identify the current phase from the year number
  const phaseMap = {
    primary: { start: 1, end: 6 },
    secondary: { start: 7, end: 11 },
  };
  const currentYearNum = parseInt(currentYear.replace("year-", ""));
  const currentPhase = currentYearNum <= 6 ? "primary" : "secondary";

  const phaseStartNum = phaseMap[currentPhase].start;
  const phaseEndNum = phaseMap[currentPhase].end;

  // Convert phases to strings for easy comparison with "year-7"/"year-11" keys
  const phaseStartYear = `year-${phaseStartNum}`;
  const phaseEndYear = `year-${phaseEndNum}`;

  // Gather the subject category titles
  const subjectCategoryTitles = Array.from(
    new Set(
      years
        .flatMap((yearKey) =>
          yearData[yearKey]?.subjectCategories?.filter((sc) =>
            subjectCategories.includes(sc.id.toString()),
          ),
        )
        .filter(Boolean)
        .map((sc) => sc?.title),
    ),
  );

  if (subjectCategoryTitles.length === 0) return null;

  // Check if the entire phase (not just the current year) has any units for the subject categories
  const hasAnyUnitsInPhase = years
    .filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      // Filter only those years in the same phase as currentYear
      return currentPhase === "primary"
        ? yNum >= 1 && yNum <= 6
        : yNum >= 7 && yNum <= 11;
    })
    .some((yearKey) =>
      yearData[yearKey]?.units?.some((unit) =>
        unit.subjectcategories?.some((sc) =>
          subjectCategories.includes(sc.id.toString()),
        ),
      ),
    );

  // Check if this current year has any units in the selected subject categories
  const hasCurrentYearUnits = yearData[currentYear]?.units?.some((unit) =>
    unit.subjectcategories?.some((sc) =>
      subjectCategories.includes(sc.id.toString()),
    ),
  );

  if (!hasCurrentYearUnits) {
    // Find the first subsequent year (in the same phase) that does have units
    const subsequentYearsInPhase = years.slice(currentIndex + 1).filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      return currentPhase === "primary"
        ? yNum >= 1 && yNum <= 6
        : yNum >= 7 && yNum <= 11;
    });

    const firstSubsequentYearWithUnits = subsequentYearsInPhase.find(
      (yearKey) =>
        yearData[yearKey]?.units?.some((unit) =>
          unit.subjectcategories?.some((sc) =>
            subjectCategories.includes(sc.id.toString()),
          ),
        ),
    );

    // If there is a future year in this phase that has units:
    if (firstSubsequentYearWithUnits) {
      const cleanYear = firstSubsequentYearWithUnits.replace("year-", "");
      const isFirstYearOfPhase =
        currentYear === phaseStartYear || currentYearNum === phaseStartNum;
      return isFirstYearOfPhase
        ? `'${subjectCategoryTitles.join(
            ", ",
          )}' units start in Year ${cleanYear}`
        : `'${subjectCategoryTitles.join(
            ", ",
          )}' units continue in Year ${cleanYear}`;
    }

    // No future years in the phase that have units or we are at the end of the phase
    const allSubsequentInPhaseEmpty = subsequentYearsInPhase.every(
      (yearKey) =>
        !yearData[yearKey]?.units?.some((unit) =>
          unit.subjectcategories?.some((sc) =>
            subjectCategories.includes(sc.id.toString()),
          ),
        ),
    );

    if (
      currentYear === phaseEndYear ||
      !hasAnyUnitsInPhase ||
      allSubsequentInPhaseEmpty
    ) {
      return `No '${subjectCategoryTitles.join(
        ", ",
      )}' units in this year group`;
    }

    // Default fallback in case of edge conditions
    return `No '${subjectCategoryTitles.join(", ")}' units in this year group`;
  }

  // If the current year does have units do not show a message
  return null;
}

// Function component

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  unitData,
  ks4OptionSlug,
  yearData,
  mobileHeaderScrollOffset,
  setUnitData,
  filters,
  setVisibleMobileYearRefID,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  function filterIncludes(key: keyof CurriculumFilters, ids: string[]) {
    const filterValues = filters[key];
    return ids.every((id) => {
      return filterValues.includes(id);
    });
  }

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

  const trackModalOpenEvent = (isOpen: boolean, unitData: Unit) => {
    if (isOpen && unitData) {
      track.unitInformationViewed({
        unitName: unitData.title,
        unitSlug: unitData.slug,
        subjectTitle: unitData.subject,
        subjectSlug: unitData.subject_slug,
        yearGroupName: unitData.year,
        yearGroupSlug: unitData.year,
        unitHighlighted: isHighlightedUnit(unitData, filters.threads),
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

  return (
    <OakBox id="content" data-testid="curriculum-visualiser">
      {yearData &&
        Object.keys(yearData)
          .filter((year) => filterIncludes("years", [year]))
          .sort(sortYears)
          .map((year, index) => {
            const { units, isSwimming } = yearData[year] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };

            const filteredUnits = units.filter((unit: Unit) =>
              isVisibleUnit(filters, year, unit),
            );

            const dedupedUnits = dedupUnits(filteredUnits);

            const actions = units[0]?.actions;

            const yearTitle = getYearGroupTitle(
              yearData,
              year,
              getSuffixFromFeatures(actions),
            );

            const yearSubheadingText = getYearSubheadingText(
              yearData,
              year,
              filters,
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
                  $mb={
                    yearSubheadingText ? "space-between-xs" : "space-between-s"
                  }
                  data-testid="year-heading"
                >
                  {yearTitle}
                </OakHeading>

                {yearSubheadingText && (
                  <OakHeading
                    tag="h4"
                    $font={"heading-7"}
                    $mb="space-between-s"
                    $color="text-primary"
                    data-testid="year-subheading"
                  >
                    {yearSubheadingText}
                  </OakHeading>
                )}

                {isSwimming && (
                  <Alert
                    $mb="space-between-s"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
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
                    {dedupedUnits.length < 1 && (
                      <OakP>
                        {getSubjectCategoryMessage(
                          yearData,
                          year,
                          filters.subjectCategories,
                        )}
                      </OakP>
                    )}
                    {dedupedUnits.map((unit: Unit, index: number) => {
                      const isHighlighted = isHighlightedUnit(
                        unit,
                        filters.threads,
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
                              handleOpenModal(unitOptions, unit);
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
            filters.tiers[0],
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
          />
        </UnitsTabSidebar>
      )}
    </OakBox>
  );
};
export default CurriculumVisualiser;
