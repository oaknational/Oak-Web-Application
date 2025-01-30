import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import { SubjectPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/subjectPhaseOptions/subjectPhaseOptions.query";

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  ks4OptionSlug: string | null;
};

export const parseSubjectPhaseSlug = (
  slug: string,
): CurriculumSelectionSlugs | undefined => {
  const parts = slug.split("-");
  const lastSlug = parts.pop() ?? null;
  let phaseSlug: string | null, ks4OptionSlug: string | null;
  // Use phase to determine if examboard is present
  if (lastSlug && ["primary", "secondary"].includes(lastSlug)) {
    ks4OptionSlug = null;
    phaseSlug = lastSlug;
  } else {
    ks4OptionSlug = lastSlug;
    phaseSlug = parts.pop() ?? null;
  }
  const subjectSlug = parts.join("-");
  if (!subjectSlug || !phaseSlug) {
    return;
  }
  return {
    phaseSlug: phaseSlug,
    subjectSlug: subjectSlug,
    ks4OptionSlug: ks4OptionSlug,
  };
};

export function isValidSubjectPhaseSlug(
  allSubjectPhases: SubjectPhaseOptions,
  slugs: CurriculumSelectionSlugs,
) {
  const isValid = allSubjectPhases.find((sp) => {
    const isValidSubjectSlug = sp.slug === slugs.subjectSlug;
    const hasMatchingPhase = sp.phases.find((p) => p.slug === slugs.phaseSlug);
    const isValidKs4Option =
      slugs.phaseSlug === "primary" ||
      (!sp.ks4_options && !slugs.ks4OptionSlug) ||
      sp.ks4_options?.length === 0 ||
      sp.ks4_options?.find((o) => o.slug === slugs.ks4OptionSlug);
    return isValidSubjectSlug && hasMatchingPhase && isValidKs4Option;
  });
  return !!isValid;
}

// Hardcoded set of preferences for redirects
export const KS4_EXAMBOARD_PREFERENCE: Record<string, string> = {
  "physical-education": "ocr",
  computing: "ocr",
  english: "aqa",
  geography: "aqa",
  spanish: "aqa",
  science: "aqa",
  german: "aqa",
  citizenship: "aqa",
  music: "edexcel",
  french: "aqa",
  history: "edexcel",
  "religious-education": "aqa",
  "design-technology": "aqa",
};

export function getKs4RedirectSlug(
  allSubjectPhases: SubjectPhaseOptions,
  slugs: CurriculumSelectionSlugs,
) {
  if (slugs.ks4OptionSlug) {
    return;
  }

  const match = allSubjectPhases.find((sp) => {
    const isValidSubjectSlug = sp.slug === slugs.subjectSlug;
    const hasMatchingPhase = sp.phases.find((p) => p.slug === slugs.phaseSlug);
    return isValidSubjectSlug && hasMatchingPhase;
  });
  if (!match || !match.ks4_options) {
    return;
  }

  const preferedOption =
    match.ks4_options.find(
      (opt) => opt.slug === KS4_EXAMBOARD_PREFERENCE[match.slug],
    ) ?? match.ks4_options[0]!;

  return {
    subjectSlug: match.slug,
    phaseSlug: slugs.phaseSlug,
    ks4OptionSlug: preferedOption.slug,
  };
}

export function createProgrammeSlug(
  unitData?: CurriculumUnitsTabData["units"][number] | null,
  examboardSlug?: string | null,
  tierSlug?: string,
) {
  if (unitData?.keystage_slug === "ks4") {
    return `${unitData.subject_slug}-${unitData.phase_slug}-${
      unitData.keystage_slug
    }${tierSlug ? "-" + tierSlug : ""}${
      examboardSlug ? "-" + examboardSlug : ""
    }`;
  }
  return unitData
    ? `${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`
    : "";
}

export function createTeacherProgrammeSlug(
  unitData?: CurriculumUnitsTabData["units"][number] | null,
  examboardSlug?: string | null,
  tierSlug?: string,
  pathwaySlug?: string,
) {
  if (unitData?.keystage_slug === "ks4") {
    const parts: string[] = [];
    parts.push(unitData.subject_slug);
    parts.push(unitData.phase_slug);
    parts.push(unitData.keystage_slug);
    if (tierSlug) parts.push(tierSlug);
    if (pathwaySlug) parts.push(pathwaySlug);
    if (examboardSlug) parts.push(examboardSlug);
    return parts.join("-");
  } else if (unitData) {
    return [
      unitData.subject_slug,
      unitData.phase_slug,
      unitData.keystage_slug,
    ].join("-");
  }
  return "";
}
