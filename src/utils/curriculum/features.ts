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
