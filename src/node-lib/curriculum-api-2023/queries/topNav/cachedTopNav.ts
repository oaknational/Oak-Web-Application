"use cache";

import curriculumSdk from "../../sdk";

import {
  applyCurriculumCachePolicy,
  CURRICULUM_API_CACHE_TAG,
} from "@/node-lib/cache";

export async function getCachedTopNavData() {
  applyCurriculumCachePolicy({ tags: [CURRICULUM_API_CACHE_TAG] });

  return curriculumSdk.topNav();
}
