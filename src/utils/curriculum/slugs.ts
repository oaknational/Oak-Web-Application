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

import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

export type ParsedProgrammeSlug = {
  subjectSlug: string;
  phaseSlug: string;
  keystageSlug: string | null;
  yearSlug: string | null;
  tierSlug: string | null;
  pathwaySlug: string | null;
  examboardSlug: string | null;
};

function takeOption(
  parts: string[],
  options: readonly string[],
): string | null {
  const index = parts.findIndex((part) => options.includes(part));
  return index < 0 ? null : parts.splice(index, 1)[0]!;
}

/**
 * Parses a programme slug (e.g. `biology-secondary-ks4-higher-aqa`)
 * into structured segments. Returns `null` for unrecognised slugs.
 *
 * Will fail when a known token appears in the wrong place: the first `primary`/`secondary`
 * (etc.) always ends the subject (e.g. `english-primary-secondary` → subject `english`,
 * phase `primary`, invalid tail `secondary`). The same applies if pathway, tier, or
 * examboard tokens appear inside a multi-part subject slug.
 *
 * With current data that doesn't appear to be an issue.
 */
export function parseProgrammeSlug(
  programmeSlug: string,
): ParsedProgrammeSlug | null {
  const parts = programmeSlug.split("-");

  // Legacy download/listing suffix (e.g. `-l`). Not sure if this is needed anymore but included for completeness.
  // and to support old bookmarks
  if (parts.at(-1) === "l") {
    parts.pop();
  }

  const phaseIndex = parts.findIndex((part) =>
    phaseSlugs.options.includes(part as (typeof phaseSlugs.options)[number]),
  );
  if (phaseIndex < 0) {
    return null;
  }

  // Everything before the phase is the subject.
  const subjectSlug = parts.splice(0, phaseIndex).join("-");
  if (!subjectSlugs.safeParse(subjectSlug).success) {
    return null;
  }

  const phaseSlug = parts.shift()!;
  const pathwaySlug = takeOption(parts, pathwaySlugs.options);
  const tierSlug = takeOption(parts, tierSlugs.options);
  const examboardSlug = takeOption(parts, examboardSlugs.options);

  // Remaining tokens are year or keystage (e.g. `ks3`, `year-10`).
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

  return {
    subjectSlug,
    phaseSlug,
    keystageSlug,
    yearSlug,
    tierSlug,
    pathwaySlug,
    examboardSlug,
  };
}

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  ks4OptionSlug: string | null;
  pathwaySlug?: string | null;
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

function isValidKs4Option(
  phaseSlug: string,
  ks4OptionSlug: string | null,
  ks4Options: { slug: string }[] | undefined | null,
): boolean {
  if (phaseSlug === "primary") {
    return !ks4OptionSlug;
  }
  if (!ks4Options || ks4Options.length === 0) {
    return !ks4OptionSlug;
  }
  return ks4Options.some((o) => o.slug === ks4OptionSlug);
}

export function isValidSubjectPhaseSlug(
  allSubjectPhases: CurriculumPhaseOptions,
  slugs: CurriculumSelectionSlugs,
) {
  const isValid = allSubjectPhases.find((sp) => {
    return (
      sp.slug === slugs.subjectSlug &&
      sp.phases.some((p) => p.slug === slugs.phaseSlug) &&
      isValidKs4Option(slugs.phaseSlug, slugs.ks4OptionSlug, sp.ks4_options)
    );
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

/**
 * Picks the default KS4 option slug for a subject (exam board, GCSE, core, etc.), using
 * {@link KS4_EXAMBOARD_PREFERENCE} only when that slug exists in `ks4OptionSlugs`, otherwise
 * falls back to the first entry.
 */
export function getPreferredKs4OptionSlug(
  subjectSlug: string,
  ks4OptionSlugs: readonly string[],
): string | null {
  if (!ks4OptionSlugs[0]) {
    return null;
  }

  const preferred = KS4_EXAMBOARD_PREFERENCE[subjectSlug];
  if (preferred && ks4OptionSlugs.includes(preferred)) {
    return preferred;
  }

  return ks4OptionSlugs[0];
}

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
  if (!match?.ks4_options) {
    return;
  }

  const ks4OptionSlug = getPreferredKs4OptionSlug(
    match.slug,
    match.ks4_options.map((opt) => opt.slug),
  );

  if (!ks4OptionSlug) {
    return;
  }

  return {
    subjectSlug: match.slug,
    phaseSlug: slugs.phaseSlug,
    ks4OptionSlug,
  };
}

/**
 * Resolves a subject-phase slug from available options
 */
export function resolveTeacherProgrammeSubjectPhaseSlug(
  subjects: CurriculumPhaseOptions,
  {
    subjectSlug,
    phaseSlug,
    pathwaySlug = null,
    ks4OptionSlug = null,
  }: {
    subjectSlug: string;
    phaseSlug: string;
    pathwaySlug?: string | null;
    ks4OptionSlug?: string | null;
  },
): string {
  // Pathway is already known from programme data (e.g. core, gcse) — use it
  // directly rather than inferring a KS4 option from phase options.
  if (pathwaySlug) {
    return getSubjectPhaseSlug({
      subject: subjectSlug,
      phaseSlug,
      pathwaySlug,
    });
  }

  const slugs: CurriculumSelectionSlugs = {
    subjectSlug,
    phaseSlug,
    ks4OptionSlug,
  };

  // Caller supplied a complete, valid slug (including an explicit ks4 option).
  if (isValidSubjectPhaseSlug(subjects, slugs)) {
    return getSubjectPhaseSlug({
      subject: subjectSlug,
      phaseSlug,
      examBoardSlug: ks4OptionSlug,
    });
  }

  // No ks4 option yet - pick the default from phase options (e.g. history →
  // edexcel, citizenship → gcse) so incomplete slugs still resolve to a page.
  const redirectParams = getKs4RedirectSlug(subjects, slugs);
  if (redirectParams) {
    return getSubjectPhaseSlug({
      subject: redirectParams.subjectSlug,
      phaseSlug: redirectParams.phaseSlug,
      examBoardSlug: redirectParams.ks4OptionSlug,
    });
  }

  // Subject has no ks4 options in phase options — plain subject-phase slug only.
  return getSubjectPhaseSlug({
    subject: subjectSlug,
    phaseSlug,
  });
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
