import { isVisibleUnit } from "./isVisibleUnit";

// TODO: These types should be moved out of components
import {
  YearData,
  YearSelection,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

export function getNumberOfSelectedUnits(
  yearData: YearData,
  selectedYear: string | null,
  yearSelection: YearSelection,
): number {
  let count = 0;

  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;
    if (units && (selectedYear === "" || selectedYear === year)) {
      units.forEach((unit) => {
        if (isVisibleUnit(yearSelection, year, unit)) {
          count += 1;
        }
      });
    }
  });

  return count;
}
