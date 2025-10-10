import { Redis } from "@upstash/redis";

import { suggestionsSchema, Suggestions } from "./generateSuggestions";

import getServerConfig from "@/node-lib/getServerConfig";

const redis = new Redis({
  url: getServerConfig("upstashRedisUrl"),
  token: getServerConfig("upstashRedisToken"),
});

const CACHE_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

function getCacheKey(searchTerm: string): string {
  const normalized = searchTerm.toLowerCase().replace(/\s+/g, "");
  return `search:intent:v1:${normalized}`;
}

export async function withSuggestionCache(
  searchTerm: string,
  generateSuggestions: () => Promise<Suggestions>,
): Promise<Suggestions> {
  const cacheKey = getCacheKey(searchTerm);

  // Check for the term in the cache
  const cached = await redis.get(cacheKey);

  if (cached) {
    try {
      console.log("suggestionCache: hit");
      return suggestionsSchema.parse(cached);
    } catch {
      // Invalid cache data, continue to AI call
    }
  }

  console.log("suggestionCache: miss");

  // Call the AI generation
  const result: Suggestions = await generateSuggestions();

  // Store in cache
  await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL_SECONDS });

  return result;
}
