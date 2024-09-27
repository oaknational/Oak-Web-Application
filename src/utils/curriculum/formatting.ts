import { getUnitFeatures } from "./features";

import { YearData } from "@/components/CurriculumComponents/CurriculumVisualiser";
import { Phase } from "@/node-lib/curriculum-api-2023";

export function getYearGroupTitle(
  yearData: YearData,
  year: string,
  suffix?: string,
) {
  const suffixStr = suffix ? ` ${suffix}` : "";
  if (year in yearData) {
    const { groupAs } = yearData[year]!;
    if (groupAs && year === "all-years") {
      return `${groupAs}${suffixStr} (all years)`;
    }
  }
  return `Year ${year}${suffixStr}`;
}

export function getPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  if (phase.slug === "primary") {
    const hasKs1 = keystages.find((k) => k.slug === "ks1");
    const hasKs2 = keystages.find((k) => k.slug === "ks2");
    if (hasKs1 && hasKs2) {
      return "Key stage 1 and 2";
    } else if (hasKs1) {
      return "Key stage 1";
    } else if (hasKs2) {
      return "Key stage 2";
    }
  }
  if (phase.slug === "secondary") {
    const hasKs3 = keystages.find((k) => k.slug === "ks3");
    const hasKs4 = keystages.find((k) => k.slug === "ks4");
    if (hasKs3 && hasKs4) {
      return "Key stage 3 and 4";
    } else if (hasKs3) {
      return "Key stage 3";
    } else if (hasKs4) {
      return "Key stage 4";
    }
  }
  return "";
}

export function getSuffixFromFeatures(
  features: ReturnType<typeof getUnitFeatures>,
) {
  if (features?.programmes_fields_overrides?.subject) {
    return `(${features.programmes_fields_overrides?.subject})`;
  }
  return;
}
