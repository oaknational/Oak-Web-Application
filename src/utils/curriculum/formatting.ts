import { YearData } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function getYearGroupTitle(yearData: YearData, year: string) {
  if (year in yearData) {
    const { groupAs } = yearData[year]!;
    if (groupAs && year === "all-years") {
      return `${groupAs} (all years)`;
    } else {
      return `Year ${year}`;
    }
  }
  return `Year ${year}`;
}
