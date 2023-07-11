import { UnitListingData } from "../../node-lib/curriculum-api";

export const filterLearningTheme = (
  themeSlug: string | undefined,
  units: UnitListingData["units"]
): UnitListingData["units"] => {
  if (themeSlug) {
    return units.filter((unit) => unit[0]?.themeSlug === themeSlug);
  } else {
    return units;
  }
};
