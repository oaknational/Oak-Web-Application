import { curriculumApiWithCache } from "@/node-lib/cache";

export async function getCachedTopNavData() {
  return curriculumApiWithCache({ queryKey: "topNav", args: [] });
}
