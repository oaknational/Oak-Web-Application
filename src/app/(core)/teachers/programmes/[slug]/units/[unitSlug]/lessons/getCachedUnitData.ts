import { cache } from "react";
import { permanentRedirect } from "next/navigation";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { cacheData } from "@/node-lib/cache";
import { resolveOakHref } from "@/common-lib/urls";
import { getUnitDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("unit-download-existence");

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

const getCachedUnitDownloadFileExistence = cacheData(
  getUnitDownloadFileExistence,
  ["teachers-unit-download-existence"],
);

export const getUnitDownloadExistence = async (unitFileId: string) => {
  try {
    return await getCachedUnitDownloadFileExistence(unitFileId);
  } catch (error) {
    await reportError(error, { unitFileId });
    return { exists: false, fileSize: undefined };
  }
};

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
