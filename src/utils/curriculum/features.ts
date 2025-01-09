import { Unit } from "./types";

export function getUnitFeatures(unit?: Unit | null) {
  if (!unit) {
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
    unit.keystage_slug === "ks4"
  ) {
    return {
      programmes_fields_overrides: {
        subject: "Computer Science",
      },
    };
  } else if (unit.subject_slug === "english" && unit.phase_slug === "primary") {
    return {
      subjectcategories: {
        all_disabled: true,
        default_category_id: 4,
        group_by_subjectcategory: true,
      },
    };
  } else if (
    unit.subject_slug === "english" &&
    unit.phase_slug === "secondary" &&
    unit.keystage_slug === "ks4"
  ) {
    return {
      subjectcategories: {
        all_disabled: true,
        default_category_id: 19,
        group_by_subjectcategory: true,
      },
    };
  }
}
export type UnitFeatures = ReturnType<typeof getUnitFeatures>;
