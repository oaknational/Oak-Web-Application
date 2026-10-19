import { cacheLife, cacheTag } from "next/cache";

export const DEFAULT_PAGE_DATA_REVALIDATE_SECONDS = 7200;
export const CURRICULUM_API_CACHE_TAG = "curriculum-api";

type CachePolicyOptions = {
  revalidate?: number;
  tags?: string[];
};

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
