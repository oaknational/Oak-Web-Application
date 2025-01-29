import { UnitFeatures } from "./features";
import { Subject, SubjectCategory, Unit } from "./types";

export function sortYears(a: string, b: string) {
  if (a === "All years") {
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
    features?.subject_category_actions?.default_category_id ?? -1;
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

export function sortChildSubjects(a: Subject, b: Subject) {
  // Special logic we always want combined-science first.
  if (a.subject_slug === "combined-science") return -10;
  if (b.subject_slug === "combined-science") return 10;

  // Alphabetical
  if (a.subject_slug < b.subject_slug) return -1;
  if (a.subject_slug > b.subject_slug) return 1;
  return 0;
}

export function sortUnits(a: Unit, b: Unit) {
  const aYear = parseInt(a.year, 10);
  const bYear = parseInt(b.year, 10);

  // We now have grouped years so we must order by year number and unit order.
  return aYear * 100 + a.order - (bYear * 100 + b.order);
}
