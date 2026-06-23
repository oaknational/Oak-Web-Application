import { unstable_cache } from "next/cache";

export const DEFAULT_PAGE_DATA_REVALIDATE_SECONDS = 7200;
export const CURRICULUM_API_CACHE_TAG = "curriculum-api";

type CacheDataOptions = NonNullable<Parameters<typeof unstable_cache>[2]>;

/**
 * `unstable_cache` with a default `revalidate` of {@link DEFAULT_PAGE_DATA_REVALIDATE_SECONDS}.
 *
 * Cache identity is `keyParts` + call arguments only — hardcoded options inside
 * `fn` are not keyed. Prefix `keyParts` with the page/feature.
 *
 * Prefer caching raw API/MV responses inside `fn`, and post-process after the
 * cache returns. Caching transformed data couples the cache to the transformed schema;
 * deploys that change that logic can serve stale shapes until revalidation.
 * MV data is stable; bump `keyParts` or `revalidateTag` when the GQL query changes.
 *
 * `tags` are for invalidation (`revalidateTag`), not identity. Prefer page-level
 * or domain tags (e.g. `curriculum-api`, `programme-page`) over revalidating shared
 * key segments (e.g. `curriculum-overview` in multiple pages' `keyParts`).
 *
 * @see Next 16: replace with `"use cache"` + `cacheLife` / `cacheTag`.
 */
export function cacheData<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyParts: string[],
  options?: CacheDataOptions,
): (...args: Args) => Promise<Result> {
  return unstable_cache(fn, keyParts, {
    ...options,
    revalidate: options?.revalidate ?? DEFAULT_PAGE_DATA_REVALIDATE_SECONDS,
  });
}
