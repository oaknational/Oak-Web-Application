import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { Unit, Thread, YearSelection } from "@/utils/curriculum/types";

function isHighlightedUnit(unit: Unit, selectedThread: Thread["slug"] | null) {
  if (!selectedThread) {
    return false;
  }
  return unit.threads.some((t) => t.slug === selectedThread);
}

export function highlightedUnitCount(
  yearData: CurriculumUnitsYearData,
  selectedYear: string | null,
  yearSelection: YearSelection,
  selectedThread: Thread["slug"] | null,
): number {
  let count = 0;
  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;
    if (units && (!selectedYear || selectedYear === year)) {
      units.forEach((unit) => {
        if (
          isVisibleUnit(yearSelection, year, unit) &&
          isHighlightedUnit(unit, selectedThread)
        ) {
          count++;
        }
      });
    }
  });
  return count;
}
