import { cache } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { applyCurriculumCachePolicy } from "@/node-lib/cache";

async function getCachedEyfsPageDataWithCache(subjectSlug: string) {
  "use cache";
  applyCurriculumCachePolicy();

  return curriculumApi2023.eyfsPage({ subjectSlug });
}

export const getCachedEyfsPageData = cache(getCachedEyfsPageDataWithCache);
