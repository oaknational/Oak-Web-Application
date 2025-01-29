import { Unit } from "./types";

export function getUnitFeatures(unit?: Unit | null) {
  if (!unit) {
    return;
  }

  if (unit.subject_slug === "english" && unit.phase_slug === "primary") {
    return {
      subject_category_actions: {
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
      subject_category_actions: {
        all_disabled: true,
        default_category_id: 19,
        group_by_subjectcategory: true,
      },
    };
  }

  return unit.actions;
}
export type UnitFeatures = ReturnType<typeof getUnitFeatures>;
