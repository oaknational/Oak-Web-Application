import { cache } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { cacheData } from "@/node-lib/cache";

export const getCachedEyfsPageData = cache(
  cacheData(
    async (subjectSlug: string) => {
      return curriculumApi2023.eyfsPage({ subjectSlug });
    },
    ["eyfs-page"],
  ),
);
