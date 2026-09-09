import { BrowseFilters } from "../types";

import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  getDefaultChildSubjectForYearGroup,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
} from "@/utils/curriculum/filtering";

export function getDefaultBrowseFilter(
  data: CurriculumUnitsFormattedData,
): BrowseFilters {
  return {
    childSubjects: getDefaultChildSubjectForYearGroup(data.yearData),
    subjectCategories: getDefaultSubjectCategoriesForYearGroup(data.yearData),
    tiers: getDefaultTiersForYearGroup(data.yearData),
    years: data.yearOptions,
    threads: [],
    pathways: [],
    keystages: [],
  };
}
