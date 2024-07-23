import _ from "lodash";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { UnitsSectionData } from "@/pages/pupils/programmes/[programmeSlug]/units";

interface GetSecondUnitSectionArgs {
  programmeSlug: string;
  baseSlug: string;
  tierSlug: string | null;
  subjectSlug: string;
  yearSlug: string;
  phase: "primary" | "secondary";
  unitsByProgramme: Record<string, UnitListingBrowseData[number][]>;
  breadcrumbs: string[];
}

export function getSecondUnitSection({
  programmeSlug,
  baseSlug,
  tierSlug,
  subjectSlug,
  yearSlug,
  phase,
  unitsByProgramme,
  breadcrumbs,
}: GetSecondUnitSectionArgs): UnitsSectionData {
  // Determine if the desired programme is a legacy programme
  const isLegacy = programmeSlug.endsWith("-l");
  const result: Partial<UnitsSectionData> = {};
  const capitalise = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);
  result.labels = {
    year: capitalise(yearSlug.replace("-", " ")),
    subject: capitalise(subjectSlug),
  };
  if (isLegacy) {
    // Check for "new" programmes that could be displayed
    result.units = Object.values(
      _.groupBy(
        unitsByProgramme[`${programmeSlug.replace("-l", "")}`] || [],
        (unit) => unit.unitData.title,
      ),
    );
    result.counterText = "Choose a unit";
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
      if (result.units.length > 0) {
        result.labels.tier = capitalise(tierSlug);
      }
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
    result.counterText = "Choose a previously released unit";
    result.counterLength = result.units.length;
  }
  return {
    units: result.units,
    phase: phase,
    counterText: result.counterText,
    counterLength: result.counterLength,
    labels: result.labels,
    title: null,
    breadcrumbs,
  };
}
