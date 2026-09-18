import { PathwayValueType } from "@/browser-lib/avo/Avo";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export function getShouldDisplayCorePathway(
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"],
) {
  const hasCorePathway = !!ks4Options?.find((opt) => opt.slug === "core");
  return hasCorePathway;
}

export function getSuffixFromPathway(pathway: string | null) {
  if (pathway === "core") {
    return "(Core)";
  } else if (pathway === "gcse") {
    return "(GCSE)";
  }
}

export function getPathwayTitleFromSlug(
  pathwaySlug?: string | null,
): PathwayValueType | undefined {
  switch (pathwaySlug) {
    case "gcse":
      return "GCSE";
    case "core":
      return "Core";
    default:
      return undefined;
  }
}
