import { CurriculumFilters } from "./CurriculumVisualiserFilters";

import { Unit, Thread, YearData } from "@/utils/curriculum/types";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";

function isHighlightedUnit(
  unit: Unit,
  selectedThreads: Thread["slug"][] | null,
) {
  if (!selectedThreads) {
    return false;
  }
  return unit.threads.some((t) => selectedThreads.includes(t.slug));
}

export function highlightedUnitCount(
  yearData: YearData,
  filters: CurriculumFilters,
  selectedThreads: Thread["slug"][] | null,
): number {
  let count = 0;
  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;
    if (units && filters.years.includes(year)) {
      units.forEach((unit) => {
        if (
          isVisibleUnit(filters, year, unit) &&
          isHighlightedUnit(unit, selectedThreads)
        ) {
          count++;
        }
      });
    }
  });
  return count;
}
