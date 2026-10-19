import { applyCurriculumCachePolicy } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export async function getCachedMvRefreshTimes() {
  "use cache";
  applyCurriculumCachePolicy();

  return curriculumApi2023.refreshedMVTime({
    viewName: "mv_curriculum_sequence_b%",
  });
}
