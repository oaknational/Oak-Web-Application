import { unstable_cache } from "next/cache";
import { cache } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const getCachedUnitData = cache(
  unstable_cache(
    async (programmeSlug: string, unitSlug: string) => {
      return curriculumApi2023.teachersUnitOverview({
        programmeSlug,
        unitSlug,
      });
    },
    ["teachers-unit-overview"],
  ),
);
