import React, { FC, useState, useRef, useEffect } from "react";
import { OakHeading, OakFlex, OakBox, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

import Alert from "../OakComponentsKitchen/Alert";
import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";
import { CurriculumFilters } from "../CurriculumVisualiserFilters/CurriculumVisualiserFilters";

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
} from "@/utils/curriculum/formatting";
import { getUnitFeatures } from "@/utils/curriculum/features";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { sortYears } from "@/utils/curriculum/sorting";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { Unit, YearData } from "@/utils/curriculum/types";

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
  ks4OptionSlug: string | null;
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

  // Phase boundary detection
  const phaseMap = {
    primary: { start: 1, end: 6 },
    secondary: { start: 7, end: 11 },
  };

  const currentYearNum = parseInt(currentYear.replace("year-", ""));
  const currentPhase = currentYearNum <= 6 ? "primary" : "secondary";
  const phaseEndYear = `year-${phaseMap[currentPhase].end}`;

  // Get category titles and check for any units in phase
  const categoryTitles = Array.from(
    new Set(
      years
        .flatMap((year) =>
          yearData[year]?.subjectCategories
            .filter((sc) => subjectCategories.includes(sc.id.toString()))
            .map((sc) => sc.title),
        )
        .filter(Boolean),
    ),
  );

  if (categoryTitles.length === 0) return null;

  // First check if any units exist in the entire phase
  const hasAnyUnitsInPhase = years
    .filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      return currentPhase === "primary" ? yNum <= 6 : yNum >= 7 && yNum <= 11;
    })
    .some((year) =>
      yearData[year]?.units.some((unit) =>
        unit.subjectcategories?.some((sc) =>
          subjectCategories.includes(sc.id.toString()),
        ),
      ),
    );

  if (!hasAnyUnitsInPhase) {
    return `No ${categoryTitles.join(", ")} units in this year`;
  }

  // Then check if the current year has any units for the selected subject category
  const hasCurrentYearUnits = yearData[currentYear]?.units.some((unit) =>
    unit.subjectcategories?.some((sc) =>
      subjectCategories.includes(sc.id.toString()),
    ),
  );

  if (!hasCurrentYearUnits) {
    // Find first subsequent year with units for subject category
    const subsequentYears = years.slice(currentIndex + 1).filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      return currentPhase === "primary" ? yNum <= 6 : yNum >= 7;
    });

    const firstSubsequentYearWithUnits = subsequentYears.find((year) =>
      yearData[year]?.units.some((unit) =>
        unit.subjectcategories?.some((sc) =>
          subjectCategories.includes(sc.id.toString()),
        ),
      ),
    );

    if (firstSubsequentYearWithUnits) {
      const cleanYear = firstSubsequentYearWithUnits.replace("year-", "");
      return `'${categoryTitles.join(", ")}' units continue in Year ${cleanYear}`;
    }

    // If no subsequent units in phase, check if the year is the last year of the phase
    if (currentYear === phaseEndYear) {
      return `No further ${categoryTitles.join(", ")} units in this year`;
    }

    // Check if all remaining years in phase lack units
    const allSubsequentInPhaseEmpty = subsequentYears.every(
      (year) =>
        !yearData[year]?.units.some((unit) =>
          unit.subjectcategories?.some((sc) =>
            subjectCategories.includes(sc.id.toString()),
          ),
        ),
    );

    if (allSubsequentInPhaseEmpty) {
      return currentPhase === "primary"
        ? `No further '${categoryTitles.join(", ")}' units`
        : `No further '${categoryTitles.join(", ")}' units`;
    }

    // Fallback to previous implementation for edge cases
    const previousYears = years.slice(0, currentIndex).reverse();
    const firstPreviousYearWithUnits = previousYears.find((year) =>
      yearData[year]?.units.some((unit) =>
        unit.subjectcategories?.some((sc) =>
          subjectCategories.includes(sc.id.toString()),
        ),
      ),
    );

    if (firstPreviousYearWithUnits) {
      const cleanYear = firstPreviousYearWithUnits.replace("year-", "");
      return `'${categoryTitles.join(", ")}' units start in Year ${cleanYear}`;
    }

    return `No ${categoryTitles.join(", ")} units in this year`;
  }

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
            const { units, labels } = yearData[year] as YearData[string];

            const ref = (element: HTMLDivElement) => {
              itemEls.current[index] = element;
            };

            const filteredUnits = units.filter((unit: Unit) =>
              isVisibleUnit(filters, year, unit),
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
                        ) || "No units for filter in this year"}
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
