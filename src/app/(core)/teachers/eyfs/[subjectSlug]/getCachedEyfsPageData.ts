import { cache } from "react";

import { curriculumApiWithCache } from "@/node-lib/cache";

async function getCachedEyfsPageDataWithCache(subjectSlug: string) {
  return curriculumApiWithCache({
    queryKey: "eyfsPage",
    args: [{ subjectSlug }],
  });
}

export const getCachedEyfsPageData = cache(getCachedEyfsPageDataWithCache);
