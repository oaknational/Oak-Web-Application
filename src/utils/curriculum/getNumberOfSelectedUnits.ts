import { dedupUnits } from "../../components/CurriculumComponents/CurriculumVisualiser/CurriculumVisualiser";

import { isVisibleUnit } from "./isVisibleUnit";
import { YearData, YearSelection } from "./types";

export function getNumberOfSelectedUnits(
  yearData: YearData,
  selectedYear: string | null,
  yearSelection: YearSelection,
): number {
  let count = 0;

  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;

    if (units && (selectedYear === "" || selectedYear === year)) {
      const filteredUnits = units.filter((unit) => {
        return isVisibleUnit(yearSelection, year, unit);
      });

      const dedupedUnits = dedupUnits(filteredUnits);

      dedupedUnits.forEach(() => {
        count += 1;
      });
    }
  });

  return count;
}
