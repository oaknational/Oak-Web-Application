import { cache } from "react";
import { permanentRedirect } from "next/navigation";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { applyCachePolicy } from "@/node-lib/cache";
import { resolveOakHref } from "@/common-lib/urls";

export const getCachedUnitData = cache(
  async (programmeSlug: string, unitSlug: string) => {
    "use cache";
    applyCachePolicy();

    return curriculumApi2023.teachersUnitOverview({
      programmeSlug,
      unitSlug,
    });
  },
);

export const getCachedProgrammesForUnit = cache(async (unitSlug: string) => {
  "use cache";
  applyCachePolicy();

  return curriculumApi2023.teachersUnitProgramme({ unitSlug });
});

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

export const redirectUnitPageIfNeeded = async ({
  unitSlug,
  programmeSlug,
}: {
  unitSlug: string;
  programmeSlug: string;
}) => {
  const validProgrammeSlug = await getValidProgrammeSlug({
    programmeSlug,
    unitSlug,
  });

  if (validProgrammeSlug !== programmeSlug) {
    permanentRedirect(
      resolveOakHref({
        page: "unit-overview",
        unitSlug,
        programmeSlug: validProgrammeSlug,
      }),
    );
  }
};
