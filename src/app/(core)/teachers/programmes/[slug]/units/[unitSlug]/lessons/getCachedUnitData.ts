import { cache } from "react";
import { permanentRedirect } from "next/navigation";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { cacheData } from "@/node-lib/cache";
import { resolveOakHref } from "@/common-lib/urls";
import { getUnitDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import errorReporter from "@/common-lib/error-reporter";
import { UnitDownloadExistence } from "@/components/TeacherComponents/types/downloadAndShare.types";

const reportError = errorReporter("unit-download-existence");

const RETRY_DELAYS_MS = [250, 500];

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

const fetchUnitDownloadFileExistence = (
  unitFileId: string,
  attempt = 0,
): ReturnType<typeof getUnitDownloadFileExistence> =>
  getUnitDownloadFileExistence(unitFileId).catch(async (error) => {
    const delayMs = RETRY_DELAYS_MS[attempt];
    if (delayMs === undefined) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchUnitDownloadFileExistence(unitFileId, attempt + 1);
  });

const getCachedUnitDownloadFileExistence = cacheData(
  fetchUnitDownloadFileExistence,
  ["teachers-unit-download-existence"],
);

export const getUnitDownloadExistence = async (
  unitFileId: string,
): Promise<UnitDownloadExistence> => {
  try {
    const result = await getCachedUnitDownloadFileExistence(unitFileId);
    return { ...result, checkFailed: false };
  } catch (error) {
    await reportError(error, { unitFileId });
    return { checkFailed: true, exists: undefined };
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
