import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { Tier } from "@/utils/curriculum/types";

const BASE_TIER: Tier = {
  tier: "Blank",
  tier_slug: "blank",
};

export function createTier(partial: Partial<Tier> = {}) {
  const tier = getTitleFromSlug(partial?.tier_slug);
  return {
    ...BASE_TIER,
    ...(tier ? { tier } : {}),
    ...partial,
  };
}
