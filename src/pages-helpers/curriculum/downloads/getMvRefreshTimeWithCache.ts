import { curriculumApiWithCache } from "@/node-lib/cache";

export async function getCachedMvRefreshTimes() {
  return curriculumApiWithCache({
    queryKey: "refreshedMVTime",
    args: [{ viewName: "mv_curriculum_sequence_b%" }],
  });
}
