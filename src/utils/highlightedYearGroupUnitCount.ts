import {
  isVisibleUnit,
  YearData,
  YearSelection,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

function highlightedYearGroupUnitCount(
  yearData: YearData,
  selectedYear: string | null,
  yearSelection: YearSelection,
): number {
  let count = 0;

  Object.keys(yearData).forEach((year) => {
    const units = yearData[year]?.units;
    if (units && (selectedYear === "" || selectedYear === year)) {
      units.forEach((unit) => {
        isVisibleUnit(yearSelection, year, unit) ? count++ : count;
      });
    }
  });

  return count;
}

export default highlightedYearGroupUnitCount;
