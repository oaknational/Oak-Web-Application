import { getKeyStageTitle } from "./UnitList";

import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { Unit } from "@/utils/curriculum/types";

export const getSavePropsForUnitCard = (unit: Unit) => {
  const isOptionalityUnit = unit.unit_options.length > 0;

  if (isOptionalityUnit) {
    return;
  }

  return {
    unitSlug: unit.slug,
    unitTitle: unit.title,
    programmeSlug: createTeacherProgrammeSlug(
      unit,
      unit.examboard_slug,
      unit.tier_slug ?? undefined,
      unit.pathway_slug ?? undefined,
    ),
    trackingProps: {
      savedFrom: "unit_listing_save_button" as const,
      keyStageSlug: unit.keystage_slug,
      keyStageTitle: getKeyStageTitle(unit.keystage_slug),
      subjectTitle: unit.subject,
      subjectSlug: unit.subject_slug,
    },
  };
};
