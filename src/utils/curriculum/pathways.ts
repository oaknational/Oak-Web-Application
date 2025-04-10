import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export function getShouldDisplayCorePathway(
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"],
) {
  const hasCorePathway = !!ks4Options?.find((opt) => opt.slug === "core");
  return hasCorePathway;
}
