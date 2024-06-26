import _ from "lodash";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

interface GetSecondUnitSectionArgs {
  programmeSlug: string;
  baseSlug: string;
  tierSlug: string | null;
  phase: "primary" | "secondary";
  unitsByProgramme: Record<string, UnitListingBrowseData[number][]>;
}

export function getSecondUnitSection({
  programmeSlug,
  baseSlug,
  tierSlug,
  phase,
  unitsByProgramme,
}: GetSecondUnitSectionArgs): UnitsSectionData {
  // Determine if the desired programme is a legacy programme
  const isLegacy = programmeSlug.endsWith("-l");
  const result: Partial<UnitsSectionData> = {};
  if (isLegacy) {
    // Check for "new" programmes that could be displayed
    result.units = Object.values(
      _.groupBy(
        unitsByProgramme[`${programmeSlug.replace("-l", "")}`] || [],
        (unit) => unit.unitData.title,
      ),
    );
    result.counterText = "Choose a new unit";
    result.counterLength = result.units.length;
  } else {
    // Check for "legacy" programmes that could be displayed
    // Match the tier slug if it exists
    if (tierSlug) {
      result.units = Object.values(
        _.groupBy(
          unitsByProgramme[`${baseSlug}-${tierSlug}-l`] || [],
          (unit) => unit.unitData.title,
        ),
      );
    }
    // If no tier slug is found, display all legacy units
    if (!result.units || result.units.length === 0) {
      result.units = Object.values(
        _.groupBy(
          unitsByProgramme[`${baseSlug}-l`] || [],
          (unit) => unit.unitData.title,
        ),
      );
    }
    result.counterText = "Choose a legacy unit";
    result.counterLength = result.units.length;
  }
  return {
    units: result.units,
    phase: phase,
    counterText: result.counterText,
    counterLength: result.counterLength,
    title: null,
  };
}
