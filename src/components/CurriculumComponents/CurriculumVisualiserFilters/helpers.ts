// import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";
// import { Unit, Thread } from "@/utils/curriculum/types";
// import { CurriculumFilters } from "./CurriculumVisualiserFilters";

// function isHighlightedUnit(unit: Unit, selectedThread: Thread["slug"] | null) {
//   if (!selectedThread) {
//     return false;
//   }
//   return unit.threads.some((t) => t.slug === selectedThread);
// }

export function highlightedUnitCount(): number {
  // yearData: CurriculumUnitsYearData,
  // selectedYear: string | null,
  // filters: CurriculumFilters,
  // selectedThread: Thread["slug"] | null,
  // let count = 0;
  // Object.keys(yearData).forEach((year) => {
  //   const units = yearData[year]?.units;
  //   if (units && (!selectedYear || selectedYear === year)) {
  //     units.forEach((unit) => {
  //       if (
  //         isVisibleUnit(yearSelection, year, unit) &&
  //         isHighlightedUnit(unit, selectedThread)
  //       ) {
  //         count++;
  //       }
  //     });
  //   }
  // });
  // return count;
  return 0;
}
