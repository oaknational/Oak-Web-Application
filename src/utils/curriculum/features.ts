import { ENABLE_CYCLE_2 } from "./constants";

import {
  SubjectCategory,
  Unit,
} from "@/components/CurriculumComponents/CurriculumVisualiser";

export function isCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
}

export function useCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
}

type filterSubjectCategoriesOnFeaturesReturn = (
  subjectCategory: Pick<SubjectCategory, "id">,
) => boolean;
export function filterSubjectCategoriesOnFeatures(
  features: ReturnType<typeof getUnitFeatures>,
): filterSubjectCategoriesOnFeaturesReturn {
  const exclusions = features?.subjectcategories?.exclude;
  if (exclusions) {
    return (subjectCategory) => {
      return exclusions.findIndex((e) => e.id === subjectCategory.id) === -1;
    };
  }
  return () => true;
}

export function getUnitFeatures(unit?: Unit | null) {
  if (!unit) {
    return;
  }

  if (!isCycleTwoEnabled()) {
    // Early exit
    return;
  }

  if (unit.features?.pe_swimming) {
    return {
      labels: ["swimming"],
      exclusions: ["pupils"],
      group_as: "Swimming and water safety",
      programmes_fields_overrides: {
        year: "all-years",
        keystage: "All keystages",
      },
    };
  } else if (
    unit.subject_slug === "computing" &&
    unit.pathway_slug === "gcse" &&
    ["10", "11"].includes(unit.year)
  ) {
    return {
      programmes_fields_overrides: {
        subject: "Computer Science",
      },
    };
  } else if (unit.subject_slug === "english") {
    return {
      subjectcategories: {
        exclude: [{ id: -1 }],
      },
    };
  }
}
