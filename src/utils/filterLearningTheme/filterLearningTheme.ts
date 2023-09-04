import { UnitListingData } from "../../node-lib/curriculum-api";

export const filterLearningTheme = (
  themeSlug: string | undefined,
  units: UnitListingData["units"],
): UnitListingData["units"] => {
  if (themeSlug) {
    const filteredUnits = units.filter((unitVariant) =>
      unitVariant.some((unit) =>
        unit.learningThemes.some(
          (learningTheme) => learningTheme.themeSlug === themeSlug,
        ),
      ),
    );

    return filteredUnits;
  } else {
    return units;
  }
};
