import { UnitListingData } from "@/node-lib/curriculum-api";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

export const filterLearningTheme = <
  T extends SpecialistUnitListingData["units"] | UnitListingData["units"],
>(
  themeSlug: string | undefined,
  units: T,
): T => {
  if (themeSlug) {
    const filteredUnits = units.filter((unitVariant: T[number]) =>
      unitVariant.some(
        (unit) =>
          unit.learningThemes?.some(
            (learningTheme) => learningTheme.themeSlug === themeSlug,
          ),
      ),
    );

    return filteredUnits as T;
  } else {
    return units as T;
  }
};
