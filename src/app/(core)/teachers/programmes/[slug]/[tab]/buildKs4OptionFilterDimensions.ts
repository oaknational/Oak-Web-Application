import type { CurriculumSequenceSlugUnit } from "@/node-lib/curriculum-api-2023/queries/curriculumSequenceSlugs/curriculumSequenceSlugs.schema";
import {
  isExamboardSlug,
  isPathwaySlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

export type Ks4OptionFilterDimension = {
  tierSlugs: string[];
  pathwaySlugs: string[];
  childSubjectSlugs: string[];
};

type MutableKs4OptionFilterDimension = {
  tierSlugs: Set<string>;
  pathwaySlugs: Set<string>;
  childSubjectSlugs: Set<string>;
};

const toSortedArray = (values: Set<string>) =>
  [...values].toSorted((a, b) => a.localeCompare(b));

const applyUnitToOption = (
  unit: CurriculumSequenceSlugUnit,
  optionDimensions: MutableKs4OptionFilterDimension,
) => {
  if (unit.tier_slug) {
    optionDimensions.tierSlugs.add(unit.tier_slug);
  }
  if (unit.pathway_slug) {
    optionDimensions.pathwaySlugs.add(unit.pathway_slug);
  }
  if (unit.subject_parent_slug) {
    optionDimensions.childSubjectSlugs.add(unit.subject_slug);
  }
};

/**
 * Whether a unit would be included when loading a given KS4 option programme.
 * Mirrors curriculumSequence slug matching so filter dimensions reflect what
 * each destination option actually contains.
 */
const unitMatchesKs4Option = (
  unit: CurriculumSequenceSlugUnit,
  optionSlug: string,
): boolean => {
  if (optionSlug !== "core" && unit.pathway_slug === "core") {
    return false;
  }

  if (isExamboardSlug(optionSlug)) {
    return unit.examboard_slug === null || unit.examboard_slug === optionSlug;
  }

  if (isPathwaySlug(optionSlug)) {
    return unit.pathway_slug === null || unit.pathway_slug === optionSlug;
  }

  return false;
};

/**
 * Derives which tier, pathway, and child-subject filters are valid for each KS4
 * option (pathway or exam board). Used when switching options so incompatible
 * query params are dropped rather than carried over.
 */
export function buildKs4OptionFilterDimensions(
  units: CurriculumSequenceSlugUnit[],
  ks4OptionSlugs: string[],
): Record<string, Ks4OptionFilterDimension> {
  const dimensions = new Map<string, MutableKs4OptionFilterDimension>(
    ks4OptionSlugs.map((slug) => [
      slug,
      {
        tierSlugs: new Set(),
        pathwaySlugs: new Set(),
        childSubjectSlugs: new Set(),
      },
    ]),
  );

  for (const unit of units) {
    for (const slug of ks4OptionSlugs) {
      if (unitMatchesKs4Option(unit, slug)) {
        applyUnitToOption(unit, dimensions.get(slug)!);
      }
    }
  }

  const result: Record<string, Ks4OptionFilterDimension> = {};

  for (const slug of ks4OptionSlugs) {
    const optionDimensions = dimensions.get(slug)!;

    result[slug] = {
      tierSlugs: toSortedArray(optionDimensions.tierSlugs),
      pathwaySlugs: toSortedArray(optionDimensions.pathwaySlugs),
      childSubjectSlugs: toSortedArray(optionDimensions.childSubjectSlugs),
    };
  }

  return result;
}
