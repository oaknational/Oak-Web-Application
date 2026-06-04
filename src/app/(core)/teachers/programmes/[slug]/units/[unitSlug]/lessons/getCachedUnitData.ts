import { cache } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { cacheData } from "@/node-lib/cache";

export const getCachedUnitData = cache(
  cacheData(
    async (programmeSlug: string, unitSlug: string) => {
      return curriculumApi2023.teachersUnitOverview({
        programmeSlug,
        unitSlug,
      });
    },
    ["teachers-unit-overview"],
  ),
);

export const getCachedProgrammesForUnit = cache(
  cacheData(
    async (unitSlug: string) => {
      return curriculumApi2023.teachersUnitProgramme({ unitSlug });
    },
    ["teachers-unit-programme"],
  ),
);

// Validate the programme slug against valid programmes for the given unit
// If no match exists, return the first valid programme for the unit
export const getValidProgrammeSlug = async ({
  unitSlug,
  programmeSlug,
}: {
  unitSlug: string;
  programmeSlug: string;
}) => {
  const programmes = await getCachedProgrammesForUnit(unitSlug);
  const programmeForUnit = programmes.find(
    (p) => p.programme_slug === programmeSlug,
  );
  if (programmeForUnit) {
    return programmeSlug;
  } else {
    return programmes[0]!.programme_slug;
  }
};
