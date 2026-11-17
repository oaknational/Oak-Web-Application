import { cacheLife, cacheTag } from "next/cache";

import CMSClient from "@/node-lib/cms";
import curriculumApi, {
  type CurriculumApi,
} from "@/node-lib/curriculum-api-2023";

export const CURRICULUM_API_CACHE_TAG = "curriculum-api";
export const CMS_CACHE_TAG = "cms";

type CurriculumQueryCacheProps<K extends keyof CurriculumApi> = {
  queryKey: K;
  args: Parameters<CurriculumApi[K]>;
  tags?: string[];
};

type CmsClient = typeof CMSClient;

type CmsQueryCacheProps<K extends keyof CmsClient> = {
  queryKey: K;
  args: Parameters<CmsClient[K]>;
  tags?: string[];
};

/** Runs and caches a CMS query. Keep draft reads outside this shared cache. */
export async function cmsWithCache<K extends keyof CmsClient>({
  queryKey,
  args,
  tags = [],
}: CmsQueryCacheProps<K>): Promise<Awaited<ReturnType<CmsClient[K]>>> {
  "use cache";
  cacheLife("cms");
  cacheTag(CMS_CACHE_TAG, ...tags);
  const queries: {
    [Key in keyof CmsClient]: (
      ...args: Parameters<CmsClient[Key]>
    ) => ReturnType<CmsClient[Key]>;
  } = CMSClient;
  return await queries[queryKey](...args);
}

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
