import { cacheLife, cacheTag } from "next/cache";

import curriculumApi, {
  type CurriculumApi,
} from "@/node-lib/curriculum-api-2023";

export const DEFAULT_PAGE_DATA_REVALIDATE_SECONDS = 7200;
export const CURRICULUM_API_CACHE_TAG = "curriculum-api";

type CachePolicyOptions = {
  revalidate?: number;
  tags?: string[];
};

type CurriculumQueryCacheProps<K extends keyof CurriculumApi> = {
  queryKey: K;
  args: Parameters<CurriculumApi[K]>;
  tags?: string[];
};

/** Runs and caches a curriculum query with optional additional invalidation tags. */
export async function curriculumApiWithCache<K extends keyof CurriculumApi>({
  queryKey,
  args,
  tags = [],
}: CurriculumQueryCacheProps<K>): Promise<
  Awaited<ReturnType<CurriculumApi[K]>>
> {
  "use cache";
  cacheLife("curriculum");
  cacheTag(CURRICULUM_API_CACHE_TAG, ...tags);
  const query = curriculumApi[queryKey] as (
    ...args: Parameters<CurriculumApi[K]>
  ) => ReturnType<CurriculumApi[K]>;
  return await query(...args);
}

// For caching curriculum data with default parameters
export function applyCurriculumCachePolicy(options: CachePolicyOptions = {}) {
  cacheLife("curriculum");
  if (options.tags?.length) {
    cacheTag(...options.tags);
  }
}

// For caching CMS data with default parameters
export function applyCmsCachePolicy(options: CachePolicyOptions = {}) {
  cacheLife("cms");
  if (options.tags?.length) {
    cacheTag(...options.tags);
  }
}

// For caching other requests with a custom revalidate time
export function applyCachePolicy(options: CachePolicyOptions = {}): void {
  cacheLife({
    revalidate: options.revalidate ?? DEFAULT_PAGE_DATA_REVALIDATE_SECONDS,
  });

  if (options.tags?.length) {
    cacheTag(...options.tags);
  }
}
