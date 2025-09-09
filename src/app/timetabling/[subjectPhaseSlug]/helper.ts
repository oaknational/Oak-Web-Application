import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export function slugsToString(slugs: CurriculumSelectionSlugs) {
  return [slugs.subjectSlug, slugs.phaseSlug, slugs.ks4OptionSlug]
    .filter(Boolean)
    .join("-");
}
