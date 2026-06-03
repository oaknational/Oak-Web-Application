import { unstable_cache } from "next/cache";

export const DEFAULT_PAGE_DATA_REVALIDATE_SECONDS = 7200;

type CacheDataOptions = NonNullable<Parameters<typeof unstable_cache>[2]>;

/**
 * `unstable_cache` with a default `revalidate`
 *
 * Note: Once we upgrade to Next 16, we can switch to a `use cache` directive
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
