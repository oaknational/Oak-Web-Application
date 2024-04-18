import { TierSchema } from "../queries/unitListing/unitListing.schema";

export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const hasCoreTierSet = new Set(["maths-ks4"]);

export const filterOutCoreTier = (
  subjectSlug?: string | null,
  keyStageSlug?: string | null,
  tiers?: TierSchema | null,
): TierSchema | null => {
  if (!subjectSlug || !keyStageSlug || !tiers) {
    return tiers || null;
  }
  const key = `${subjectSlug}-${keyStageSlug}`;
  return tiers.filter((tier) => {
    if (!hasCoreTierSet.has(key)) {
      return tier.tierSlug !== "core";
    } else {
      return tier;
    }
  });
};
