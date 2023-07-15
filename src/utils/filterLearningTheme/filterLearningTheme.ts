import { UnitListingData } from "../../node-lib/curriculum-api";

export const filterLearningTheme = (
  themeSlug: string | undefined,
  units: UnitListingData["units"]
): UnitListingData["units"] => {
  if (themeSlug) {
    const filteredUnits = [];

    for (const unitVariant of units) {
      let hasMatch = false;

      for (const unit of unitVariant) {
        for (const learningTheme of unit.learningThemes) {
          if (learningTheme.themeSlug === themeSlug) {
            filteredUnits.push(unitVariant);
            hasMatch = true;
            break;
          }
        }

        if (hasMatch) {
          break;
        }
      }
    }
    return filteredUnits;
  } else {
    return units;
  }
};
