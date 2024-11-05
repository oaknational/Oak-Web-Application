import { ENABLE_CYCLE_2 } from "./constants";
import { Unit } from "./types";

export function isCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
}

export function useCycleTwoEnabled() {
  return ENABLE_CYCLE_2;
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
  } else if (unit.subject_slug === "english" && unit.phase_slug === "primary") {
    return {
      subjectcategories: {
        all_disabled: true,
        default_category_id: 4,
      },
    };
  } else if (
    unit.subject_slug === "english" &&
    unit.phase_slug === "secondary"
  ) {
    return {
      subjectcategories: {
        all_disabled: true,
        default_category_id: 19,
      },
    };
  }
}
export type UnitFeatures = ReturnType<typeof getUnitFeatures>;
