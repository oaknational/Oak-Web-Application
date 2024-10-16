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
      !sp.ks4_options ||
      sp.ks4_options.length === 0 ||
      sp.ks4_options.find((o) => o.slug === slugs.ks4OptionSlug);
    return isValidSubjectSlug && hasMatchingPhase && isValidKs4Option;
  });
  return !!isValid;
}
