import { OakFlex, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

import CurriculumUnitCard from "../CurriculumUnitCard/CurriculumUnitCard";

import { isHighlightedUnit } from "@/utils/curriculum/filtering";
import { CurriculumFilters, Unit, YearData } from "@/utils/curriculum/types";
import { sortYears } from "@/utils/curriculum/sorting";

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
            subjectCategories.includes(sc.slug),
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
          subjectCategories.includes(sc.slug),
        ),
      ),
    );

  // Check if this current year has any units in the selected subject categories
  const hasCurrentYearUnits = yearData[currentYear]?.units?.some((unit) =>
    unit.subjectcategories?.some((sc) => subjectCategories.includes(sc.slug)),
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
            subjectCategories.includes(sc.slug),
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

type CurricVisualiserUnitListProps = {
  units: Unit[];
  filters: CurriculumFilters;
  year: string;
  yearData: YearData;
  onOpenModal: (
    unitOptions: boolean,
    unit: Unit,
    isHighlighted: boolean,
  ) => void;
};
export function CurricVisualiserUnitList({
  units,
  yearData,
  year,
  filters,
  onOpenModal,
}: CurricVisualiserUnitListProps) {
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
            onOpenModal(unitOptions, unit, isHighlighted);
          }}
        />
      </UnitListItem>
    );
  }

  return (
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
  );
}
