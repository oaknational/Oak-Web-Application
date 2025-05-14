import { filteringFromYears } from "./filtering";
import { isVisibleUnit } from "./isVisibleUnit";
import { CurriculumFilters, Unit, YearData } from "./types";

export function getNumberOfSelectedUnits(
  yearData: YearData,
  selectedYear: string | null,
  filters: CurriculumFilters,
): number {
  let count = 0;

  Object.entries(yearData).forEach(([year, yearDataItem]) => {
    const units = yearDataItem.units;
    const yearBasedFilters = filteringFromYears(yearDataItem!, filters);

    if (units && (selectedYear === "all" || selectedYear === year)) {
      const filteredUnits = units.filter((unit: Unit) => {
        return isVisibleUnit(yearBasedFilters, year, unit);
      });

      filteredUnits.forEach(() => {
        count += 1;
      });
    }
  });

  return count;
}
