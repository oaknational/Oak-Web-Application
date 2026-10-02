import { applyCachePolicy } from "@/node-lib/cache";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export function getCachedMvRefreshTimes() {
  "use cache";
  applyCachePolicy();

  return curriculumApi2023.refreshedMVTime({
    viewName: "mv_curriculum_sequence_b%",
  });
}
