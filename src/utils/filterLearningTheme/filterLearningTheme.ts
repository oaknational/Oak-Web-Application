import { UnitListingData } from "@/node-lib/curriculum-api";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

export const filterLearningTheme = (
  themeSlug: string | undefined,
  units: UnitListingData["units"],
): UnitListingData["units"] => {
  if (themeSlug) {
    const filteredUnits = units.filter((unitVariant) =>
      unitVariant.some(
        (unit) =>
          unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === themeSlug,
          ),
      ),
    );

    return filteredUnits;
  } else {
    return units;
  }
};

export const filterSpecialistLearningTheme = (
  themeSlug: string | undefined,
  units: SpecialistUnitListingData["units"],
): SpecialistUnitListingData["units"] => {
  if (themeSlug) {
    const filteredUnits = units.filter((unitVariant) =>
      unitVariant.some(
        (unit) =>
          unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === themeSlug,
          ),
      ),
    );

    return filteredUnits;
  } else {
    return units;
  }
};
