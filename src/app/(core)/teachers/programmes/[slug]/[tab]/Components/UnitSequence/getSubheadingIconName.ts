import { OakIconName } from "@oaknational/oak-components";

import { CurriculumFilters, YearData, Unit } from "@/utils/curriculum/types";
import { keystageFromYear } from "@/utils/curriculum/keystage";
import { getValidSubjectCategoryIconById } from "@/utils/getValidSubjectCategoryIconById";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

/**
 * Returns the icon name for the subject category or child subject for the
 * given units and active filters.
 */
export function getSubheadingIconName(
  year: string,
  units: Unit[],
  yearData: YearData[string] | undefined,
  filters: CurriculumFilters,
): OakIconName | null {
  const isKs4Year = keystageFromYear(year) === "ks4";

  const subjectSlug = units.at(0)?.subject_slug;

  if (!subjectSlug) {
    return null;
  }

  // Handle subject categories (KS1-KS3)
  if (
    filters.subjectCategories.length > 0 &&
    !filters.subjectCategories.includes("all") && // Skip if "All" is selected
    (!isKs4Year || filters.childSubjects.length === 0)
  ) {
    const subjectCategorySlugs = filters.subjectCategories
      .map((slug) => {
        // Try to find subject category in current year
        const subjectCategory = yearData?.subjectCategories.find((sc) => {
          return sc.slug === slug;
        });
        return subjectCategory?.slug;
      })
      .filter(Boolean);

    if (subjectCategorySlugs.length === 1) {
      const subjectCategorySlug = subjectCategorySlugs.at(0)!;
      return getValidSubjectCategoryIconById(subjectSlug, subjectCategorySlug);
    }
  }

  // Handle child subjects (KS4)
  if (filters.childSubjects.length > 0) {
    const childSubjects = filters.childSubjects.filter((slug) => {
      return yearData?.childSubjects.find((cs) => cs.subject_slug === slug);
    });

    if (childSubjects.length === 1) {
      return getValidSubjectCategoryIconById(subjectSlug, childSubjects.at(0)!);
    }
  }

  return getValidSubjectIconName(subjectSlug);
}
