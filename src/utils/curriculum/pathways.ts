import { CurriculumSelectionSlugs } from "./slugs";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export function getShouldDisplayCorePathway(
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"],
) {
  const hasCorePathway = !!ks4Options?.find((opt) => opt.slug === "core");
  return hasCorePathway;
}

export function getShouldDisplayGCSEPathway(
  slugs: CurriculumSelectionSlugs,
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"],
) {
  return (
    getShouldDisplayCorePathway(ks4Options) && slugs.ks4OptionSlug !== "core"
  );
}
