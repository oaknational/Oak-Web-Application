import { YearData } from "./types";

import { Actions } from "@/node-lib/curriculum-api-2023/shared.schema";
import { Phase } from "@/node-lib/curriculum-api-2023";
import { DownloadCategory } from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";

export function getYearGroupTitle(
  yearData: YearData,
  year: string,
  suffix?: string,
) {
  const suffixStr = suffix ? ` ${suffix}` : "";
  if (year in yearData) {
    const { groupAs } = yearData[year]!;
    if (groupAs && year === "All years") {
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
  return buildPhaseText(phase, keystages, false);
}
export function getShortPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  return buildPhaseText(phase, keystages, true);
}

function buildPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
  isShortPhase: boolean,
) {
  if (phase.slug === "primary") {
    const hasKs1 = hasKs(keystages, 1);
    const hasKs2 = hasKs(keystages, 2);
    if (hasKs1 && hasKs2) {
      return isShortPhase ? "KS1 & KS2" : "Key stage 1 and 2";
    } else if (hasKs1) {
      return isShortPhase ? "KS1" : "Key stage 1";
    } else if (hasKs2) {
      return isShortPhase ? "KS2" : "Key stage 2";
    }
  }
  if (phase.slug === "secondary") {
    const hasKs3 = hasKs(keystages, 3);
    const hasKs4 = hasKs(keystages, 4);
    if (hasKs3 && hasKs4) {
      return isShortPhase ? "KS3 & KS4" : "Key stage 3 and 4";
    } else if (hasKs3) {
      return isShortPhase ? "KS3" : "Key stage 3";
    } else if (hasKs4) {
      return isShortPhase ? "KS4" : "Key stage 4";
    }
  }
  return "";
}

const KEYSTAGES_PRIMARY = ["ks1", "ks2"];
const KEYSTAGES_SECONDARY = ["ks3", "ks4"];

export function formatKeystagesShort(keyStages: string[]) {
  const keyStagesItems: string[] = [];
  const isOnlyPrimary = keyStages.every((ks) => KEYSTAGES_PRIMARY.includes(ks));
  const isOnlySecondary = keyStages.every((ks) =>
    KEYSTAGES_SECONDARY.includes(ks),
  );
  if (isOnlyPrimary && keyStages.includes("ks1")) keyStagesItems.push("1");
  if (isOnlyPrimary && keyStages.includes("ks2")) keyStagesItems.push("2");
  if (isOnlySecondary && keyStages.includes("ks3")) keyStagesItems.push("3");
  if (isOnlySecondary && keyStages.includes("ks4")) keyStagesItems.push("4");
  return keyStagesItems.length > 0 ? `KS${keyStagesItems.join("-")}` : ``;
}

export function getSuffixFromFeatures(features: Actions) {
  if (features?.programme_field_overrides?.subject) {
    return `(${features.programme_field_overrides?.subject})`;
  }
  return;
}

export function subjectTitleWithCase(title: string) {
  if (
    ["english", "french", "spanish", "german"].includes(title.toLowerCase())
  ) {
    return [title.slice(0, 1).toUpperCase(), title.slice(1).toLowerCase()].join(
      "",
    );
  }
  return title.toLowerCase();
}

export function buildPageTitle(
  keyStages: string[],
  subject: { title: string; slug: string },
  phase: { title: string; slug: string },
) {
  let pageTitle: string = "";
  const keyStageStrings: string[] = [];
  if (keyStages.includes("ks1")) keyStageStrings.push("KS1");
  if (keyStages.includes("ks2")) keyStageStrings.push("KS2");
  if (keyStages.includes("ks3")) keyStageStrings.push("KS3");
  if (keyStages.includes("ks4")) keyStageStrings.push("KS4");
  const keyStageString = keyStageStrings.join(" & ");

  if (["primary", "secondary"].includes(phase.slug)) {
    pageTitle = `${keyStageString} ${subjectTitleWithCase(subject.title)} curriculum`;
  }
  return pageTitle;
}

export function joinWords(str: string[]) {
  return str.filter((str) => str !== "").join(" ");
}

export function getPhaseFromCategory(input: DownloadCategory) {
  if (input === "KS3" || input === "KS4") {
    return "secondary";
  }
  return "primary";
}
