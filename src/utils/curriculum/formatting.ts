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

function hasKs(keystages: { slug: string }[], num: number) {
  return keystages.find((k) => k.slug === `ks${num}`);
}

export function getPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  if (phase.slug === "primary") {
    const hasKs1 = hasKs(keystages, 1);
    const hasKs2 = hasKs(keystages, 2);
    if (hasKs1 && hasKs2) {
      return "Key stage 1 and 2";
    } else if (hasKs1) {
      return "Key stage 1";
    } else if (hasKs2) {
      return "Key stage 2";
    }
  }
  if (phase.slug === "secondary") {
    const hasKs3 = hasKs(keystages, 3);
    const hasKs4 = hasKs(keystages, 4);
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

export function getShortPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  if (phase.slug === "primary") {
    const hasKs1 = hasKs(keystages, 1);
    const hasKs2 = hasKs(keystages, 2);
    if (hasKs1 && hasKs2) {
      return "KS1 & KS2";
    } else if (hasKs1) {
      return "KS1";
    } else if (hasKs2) {
      return "KS2";
    }
  }
  if (phase.slug === "secondary") {
    const hasKs3 = hasKs(keystages, 3);
    const hasKs4 = hasKs(keystages, 4);
    if (hasKs3 && hasKs4) {
      return "KS3 & KS4";
    } else if (hasKs3) {
      return "KS3";
    } else if (hasKs4) {
      return "KS4";
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
