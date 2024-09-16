// TODO: These types should be moved out of components
import {
  YearData,
  YearSelection,
} from "@/components/CurriculumComponents/CurriculumVisualiser";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

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
        isVisibleUnit(yearSelection, year, unit) ? count++ : count;
      });
    }
  });

  return count;
}

export function isVisibleUnit(
  yearSelection: YearSelection,
  year: string,
  unit: CurriculumUnitsTabData["units"][number],
) {
  const s = yearSelection[year];
  if (!s) {
    return false;
  }
  const filterBySubject =
    !s.subject || s.subject.subject_slug === unit.subject_slug;
  const filterBySubjectCategory =
    s.subjectCategory?.id == -1 ||
    unit.subjectcategories?.findIndex(
      (subjectcategory) => subjectcategory.id === s.subjectCategory?.id,
    ) !== -1;
  const filterByTier =
    !s.tier || !unit.tier_slug || s.tier?.tier_slug === unit.tier_slug;

  // Look for duplicates that don't have an examboard, tier or subject parent
  // (i.e. aren't handled by other filters)

  return filterBySubject && filterBySubjectCategory && filterByTier;
}
