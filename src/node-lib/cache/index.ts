import { cacheLife, cacheTag } from "next/cache";

export const DEFAULT_PAGE_DATA_REVALIDATE_SECONDS = 7200;
export const CURRICULUM_API_CACHE_TAG = "curriculum-api";

type CachePolicyOptions = {
  revalidate?: number;
  tags?: string[];
};

export function applyCachePolicy(options: CachePolicyOptions = {}): void {
  cacheLife({
    revalidate: options.revalidate ?? DEFAULT_PAGE_DATA_REVALIDATE_SECONDS,
  });

  if (options.tags?.length) {
    cacheTag(...options.tags);
  }
}
