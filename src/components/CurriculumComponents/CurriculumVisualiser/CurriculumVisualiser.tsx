import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import { OakFlex, OakBox, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

import Alert from "../OakComponentsKitchen/Alert";
import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";
import { CurricYearCard } from "../CurricYearCard";

import { areLessonsAvailable } from "@/utils/curriculum/lessons";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import UnitModal from "@/components/CurriculumComponents/UnitModal/UnitModal";
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
import { filteringFromYears } from "@/utils/curriculum/filtering";
import {
  CurriculumFilters,
  Unit,
  YearData,
  Lesson,
  Thread,
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
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
  mobileHeaderScrollOffset?: number;
  setUnitData: (unit: Unit) => void;
  setVisibleMobileYearRefID: (refID: string) => void;
  threadOptions: Thread[];
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
  threadOptions,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  function filterIncludes(key: keyof CurriculumFilters, ids: string[]) {
    const filterValues = filters[key];
    return ids.every((id) => {
      return filterValues.includes(id);
    });
  }

  const selectedThread = useMemo(() => {
    return threadOptions.find((thread) => thread.slug === filters.threads[0]);
  }, [threadOptions, filters]);

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
        threadTitle: selectedThread?.title ?? null,
        threadSlug: selectedThread?.slug ?? null,
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

  function getItems(unit: Unit, index: number) {
    const isHighlighted = isHighlightedUnit(unit, filters.threads);
    const unitOptions = unit.unit_options.length >= 1;

    return (
      <UnitListItem key={`${unit.slug}-${index}`}>
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
  }

  const yearTypes = ["core"];
  if (ks4OptionSlug && ks4OptionSlug !== "core") {
    yearTypes.push("non_core");
  }

  const yearSelectors = yearTypes.flatMap((type) => {
    return (
      Object.keys(yearData)
        // HACK!
        .map((year) => ({ year, type }))
        .filter(({ year }) => {
          if (type === "non_core") {
            if (year === "10" || year === "11") {
              return true;
            } else {
              return false;
            }
          }
          return true;
        })
        .filter(({ year }) => filterIncludes("years", [year]))
        .sort((a, b) => sortYears(a.year, b.year))
    );
  });

  const unitsByYearSelector = yearSelectors.map(({ year, type }) => {
    const yearItem = yearData[year] as YearData[string];

    const yearBasedFilters = filteringFromYears(yearData[year]!, filters);

    const filteredUnits = yearItem.units.filter((unit: Unit) =>
      isVisibleUnit(yearBasedFilters, year, unit, type === "non_core"),
    );

    const dedupedUnits = dedupUnits(filteredUnits);
    return {
      selector: { type, year },
      yearItem,
      units: dedupedUnits,
    };
  });

  return (
    <OakBox id="content" data-testid="curriculum-visualiser">
      {unitsByYearSelector.flatMap((data, index) => {
        const { year, type } = data.selector;
        const { isSwimming } = data.yearItem;
        const { units } = data;
        const ref = (element: HTMLDivElement) => {
          itemEls.current[index] = element;
        };

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
          <OakBox id={year} ref={ref} key={year}>
            <AnchorTarget
              $paddingTop={mobileHeaderScrollOffset}
              id={`year-${year}`}
            />
            <CurricYearCard
              // TODO: Enable once <CurricYearCard/> has functionality
              isExamboard={type === "non_core"}
              yearTitle={yearTitle}
              yearSubheading={yearSubheadingText}
              additional={
                isSwimming && (
                  <Alert
                    $mb="space-between-s"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )
              }
            >
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
                  {units.length < 1 && (
                    <OakP>
                      {getSubjectCategoryMessage(
                        yearData,
                        year,
                        filters.subjectCategories,
                      )}
                    </OakP>
                  )}
                  {units.map(getItems)}
                  {/* Empty tiles for correct flex wrapping */}
                  {Array(3)
                    .fill(true)
                    .map((item, index) => {
                      return (
                        <OakFlex
                          key={`unit-list-item-${item}-${index}`}
                          $width={"all-spacing-19"}
                          $flexGrow={1}
                          $position={"relative"}
                        />
                      );
                    })}
                </UnitList>
              </OakFlex>
            </CurricYearCard>
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
            selectedThread={selectedThread?.slug ?? null}
          />
        </UnitsTabSidebar>
      )}
    </OakBox>
  );
};
export default CurriculumVisualiser;
