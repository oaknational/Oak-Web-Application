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
