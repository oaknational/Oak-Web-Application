import { UnitFeatures } from "./features";

import { SubjectCategory } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function sortYears(a: string, b: string) {
  if (a === "all-years") {
    return -1;
  }
  return parseInt(a) - parseInt(b);
}

type sortSubjectCategoriesOnFeaturesReturn = (
  a: Pick<SubjectCategory, "id">,
  b: Pick<SubjectCategory, "id">,
) => number;
export function sortSubjectCategoriesOnFeatures(
  features: UnitFeatures | null,
): sortSubjectCategoriesOnFeaturesReturn {
  const default_category_id =
    features?.subjectcategories?.default_category_id ?? -1;
  if (default_category_id > -1) {
    return (a, b) => {
      if (a.id === default_category_id) {
        return -100000;
      } else {
        return a.id - b.id;
      }
    };
  }
  return (a, b) => a.id - b.id;
}
