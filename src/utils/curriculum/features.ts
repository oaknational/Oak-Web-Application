import { Unit } from "./types";

export function getUnitFeatures(unit?: Unit | null) {
  if (!unit) {
    return;
  }

  return unit.actions;
}
