import { isVisibleUnit, PartialFilters } from "./isVisibleUnit";
import { Unit, YearData } from "./types";

import { dedupUnits } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function getNumberOfSelectedUnits(
  yearData: YearData,
  selectedYear: string | null,
  filter: PartialFilters,
): number {
  let count = 0;

  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;

    if (units && (selectedYear === "all" || selectedYear === year)) {
      const filteredUnits = units.filter((unit: Unit) => {
        return isVisibleUnit(filter, year, unit);
      });

      const dedupedUnits = dedupUnits(filteredUnits);

      dedupedUnits.forEach(() => {
        count += 1;
      });
    }
  });

  return count;
}
