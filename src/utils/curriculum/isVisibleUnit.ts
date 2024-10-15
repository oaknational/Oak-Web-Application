import { YearSelection } from "@/components/CurriculumComponents/CurriculumVisualiser";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

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

  return filterBySubject && filterBySubjectCategory && filterByTier;
}
