"use cache";

import curriculumSdk from "../../sdk";

import { applyCachePolicy, CURRICULUM_API_CACHE_TAG } from "@/node-lib/cache";

export async function getCachedTopNavData() {
  applyCachePolicy({ tags: [CURRICULUM_API_CACHE_TAG] });

  return curriculumSdk.topNav();
}
