import { filteringFromYears } from "./filtering";
import { isVisibleUnit } from "./isVisibleUnit";
import { CurriculumFilters, Unit, YearData } from "./types";

import { dedupUnits } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function getNumberOfSelectedUnits(
  yearData: YearData,
  selectedYear: string | null,
  filters: CurriculumFilters,
  isExamboard: boolean,
): number {
  let count = 0;

  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    const yearBasedFilters = filteringFromYears(yearDataItem!, filters);

    if (units && (selectedYear === "all" || selectedYear === year)) {
      const filteredUnits = units.filter((unit: Unit) => {
        return isVisibleUnit(yearBasedFilters, year, unit, isExamboard);
      });

      const dedupedUnits = dedupUnits(filteredUnits);

      dedupedUnits.forEach(() => {
        count += 1;
      });
    }
  });

  return count;
}
