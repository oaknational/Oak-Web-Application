import { cache } from "react";
import { permanentRedirect } from "next/navigation";

import {
  applyCurriculumCachePolicy,
  curriculumApiWithCache,
} from "@/node-lib/cache";
import { resolveOakHref } from "@/common-lib/urls";
import { getUnitDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import errorReporter from "@/common-lib/error-reporter";
import { UnitDownloadExistence } from "@/components/TeacherComponents/types/downloadAndShare.types";

const reportError = errorReporter("unit-download-existence");

export const getCachedUnitData = cache(
  async (programmeSlug: string, unitSlug: string) => {
    return curriculumApiWithCache({
      queryKey: "teachersUnitOverview",
      args: [{ programmeSlug, unitSlug }],
    });
  },
);

export const getCachedProgrammesForUnit = cache(async (unitSlug: string) => {
  return curriculumApiWithCache({
    queryKey: "teachersUnitProgramme",
    args: [{ unitSlug }],
  });
});

const getCachedUnitDownloadFileExistence = cache(async (unitFileId: string) => {
  "use cache";
  applyCurriculumCachePolicy({ tags: ["teachers-unit-download-existence"] });

  return getUnitDownloadFileExistence(unitFileId);
});

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
