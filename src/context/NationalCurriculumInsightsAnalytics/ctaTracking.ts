import type { NCInsightsCTAClickedProperties } from "@/browser-lib/avo/Avo";
import type { MultiSelectInteraction } from "@/components/SharedComponents/MultiSelect/MultiSelect";

function getSelectionAction(
  interaction: MultiSelectInteraction,
): InsightsCtaProperties["ctaAction"] {
  if (interaction.action === "open") return "open";
  if (interaction.action === "close") return "close";
  if (
    interaction.action === "unselect-all" ||
    ("selected" in interaction && !interaction.selected)
  )
    return "deselect";
  return "select";
}

function getSelectionComponentType(
  action: MultiSelectInteraction["action"],
): InsightsCtaProperties["componentType"] {
  switch (action) {
    case "option":
    case "group":
    case "select-all":
    case "unselect-all":
      return "signup_form";
    default:
      return "download_button";
  }
}

export type InsightsCtaProperties = Pick<
  NCInsightsCTAClickedProperties,
  | "ctaId"
  | "ctaText"
  | "ctaAction"
  | "componentType"
  | "sectionId"
  | "sectionType"
>;

export function getSchoolSelectionCtaProperties(
  sectionType: "downloads" | "newsletter",
): InsightsCtaProperties {
  return {
    ctaId:
      sectionType === "downloads"
        ? "download-school-selection"
        : "newsletter-school-selection",
    ctaText: "Select school or organisation",
    ctaAction: "select",
    componentType: "signup_form",
    sectionId: sectionType,
    sectionType,
  };
}

export function getDownloadSelectionCtaProperties(
  interaction: MultiSelectInteraction,
): InsightsCtaProperties {
  const ids = {
    open: "download-subject-picker-toggle",
    close: "download-subject-picker-toggle",
    "select-all": "download-select-all",
    "unselect-all": "download-unselect-all",
    option: "download-subject-selection",
    group: "download-phase-selection",
    remove: "download-selection-remove",
    confirm: "download-selection-confirm",
  } satisfies Record<
    MultiSelectInteraction["action"],
    InsightsCtaProperties["ctaId"]
  >;
  return {
    ctaId: ids[interaction.action],
    ctaAction: getSelectionAction(interaction),
    ctaText: interaction.label,
    componentType: getSelectionComponentType(interaction.action),
    sectionType: "downloads",
    sectionId: "downloads",
  };
}
