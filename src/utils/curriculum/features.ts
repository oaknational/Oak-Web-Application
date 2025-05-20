import { ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE } from "./constants";
import { Unit } from "./types";

import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

// Note: Inefficient at the moment
export function findFirstMatchingFeatures(
  yearData: CurriculumUnitsYearData,
  fn: (unit: Unit) => boolean,
) {
  const features = Object.values(yearData)
    .flatMap((a) => a.units)
    .find(fn)?.features;
  return features;
}

export function getIsUnitDescriptionEnabled(unit?: Unit | null) {
  if (ENABLE_WTWN_BY_UNIT_DESCRIPTION_FEATURE) {
    return unit?.parent_programme_features?.unit_description === true;
  } else {
    return unit?.cycle === "2";
  }
}
