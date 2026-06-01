import { unstable_cache } from "next/cache";
import { cache } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const getCachedEyfsPageData = cache(
  unstable_cache(
    async (subjectSlug: string) => {
      return curriculumApi2023.eyfsPage({ subjectSlug });
    },
    ["eyfs-page"],
  ),
);
