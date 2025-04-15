import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

const BASE_YEAR_DATA: CurriculumUnitsYearData[number] = {
  units: [],
  childSubjects: [],
  subjectCategories: [],
  tiers: [],
  pathways: [],
  isSwimming: false,
  groupAs: null,
};

export function createYearData(
  partial: Partial<CurriculumUnitsYearData[number]> = {},
) {
  return {
    ...BASE_YEAR_DATA,
    ...partial,
  };
}
