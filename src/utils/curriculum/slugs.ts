import {
  examboardSlugs,
  keystageSlugs,
  pathwaySlugs,
  phaseSlugs,
  subjectSlugs,
  tierSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";
import slugify from "slugify";

import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

export const SCIENCE_CHILD_SUBJECT_SLUGS = new Set([
  "biology",
  "chemistry",
  "physics",
  "combined-science",
]);

export type ParsedProgrammeSlug = {
  subjectSlug: string;
  phaseSlug: string;
  keystageSlug: string | null;
  yearSlug: string | null;
  tierSlug: string | null;
  pathwaySlug: string | null;
  examboardSlug: string | null;
  childSubjectSlug: string | null;
};

function findOptionIndex(parts: string[], options: readonly string[]): number {
  return parts.findIndex((part) => options.includes(part));
}

function spliceOption(
  parts: string[],
  options: readonly string[],
): string | null {
  const index = findOptionIndex(parts, options);
  if (index < 0) {
    return null;
  }
  return parts.splice(index, 1)[0] ?? null;
}

export function parseProgrammeSlug(
  programmeSlug: string,
): ParsedProgrammeSlug | null {
  const parts = programmeSlug.split("-");

  if (parts.at(-1) === "l") {
    parts.pop();
  }

  const phaseIndex = findOptionIndex(parts, phaseSlugs.options);
  if (phaseIndex < 0) {
    return null;
  }

  const subjectSlug = parts.splice(0, phaseIndex).join("-");
  if (!subjectSlugs.safeParse(subjectSlug).success) {
    return null;
  }

  const phaseSlug = parts.shift();
  if (!phaseSlug || !phaseSlugs.safeParse(phaseSlug).success) {
    return null;
  }

  const pathwaySlug = spliceOption(parts, pathwaySlugs.options);
  const tierSlug = spliceOption(parts, tierSlugs.options);
  const examboardSlug = spliceOption(parts, examboardSlugs.options);

  const yearKsSlug = parts.join("-");
  if (!yearKsSlug) {
    return null;
  }

  let keystageSlug: string | null = null;
  let yearSlug: string | null = null;

  if (yearSlugs.safeParse(yearKsSlug).success) {
    yearSlug = yearKsSlug;
  } else if (keystageSlugs.safeParse(yearKsSlug).success) {
    keystageSlug = yearKsSlug;
  } else {
    return null;
  }

  const childSubjectSlug = SCIENCE_CHILD_SUBJECT_SLUGS.has(subjectSlug)
    ? subjectSlug
    : null;

  return {
    subjectSlug,
    phaseSlug,
    keystageSlug,
    yearSlug,
    tierSlug,
    pathwaySlug,
    examboardSlug,
    childSubjectSlug,
  };
}

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  ks4OptionSlug: string | null;
};

export type CurriculumSelectionTitles = {
  phaseTitle: string;
  subjectTitle: string;
  examboardTitle: string | undefined;
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
  allSubjectPhases: CurriculumPhaseOptions,
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
  allSubjectPhases: CurriculumPhaseOptions,
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

export function createTeacherProgrammeSlug(
  unitData?: CurriculumUnitsTabData["units"][number] | null,
  examboardSlug?: string | null,
  tierSlug?: string | null,
  pathwaySlug?: string | null,
) {
  if (unitData?.keystage_slug === "ks4") {
    const parts: string[] = [];
    parts.push(
      unitData.subject_slug,
      unitData.phase_slug,
      unitData.keystage_slug,
    );

    if (tierSlug) parts.push(tierSlug);
    if (pathwaySlug) parts.push(pathwaySlug);

    if (
      examboardSlug &&
      pathwaySlug !== "core" &&
      examboardSlug !== pathwaySlug
    )
      parts.push(examboardSlug);

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

export function getTeacherSubjectPhaseSlug({
  subjectSlug,
  phaseSlug,
  examboardSlug,
  pathwaySlug,
  subjectParentTitle,
}: {
  subjectSlug: string;
  phaseSlug: string;
  examboardSlug?: string | null;
  pathwaySlug?: string | null;
  subjectParentTitle?: string | null;
}) {
  const subjectSegment = subjectParentTitle
    ? slugify(subjectParentTitle).toLocaleLowerCase()
    : subjectSlug;

  const segments = [subjectSegment, phaseSlug];

  if (examboardSlug) segments.push(examboardSlug);
  if (pathwaySlug && !examboardSlug) segments.push(pathwaySlug);

  return segments.join("-");
}
