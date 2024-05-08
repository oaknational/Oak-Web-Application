import { TierSchema } from "../queries/unitListing/unitListing.schema";

export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/* When including Core on the MV it returns on all subjects even if they do not have Core tier data,
 this function removes core from programmes that shouldn't have Core as an option*/
const hasCoreTierSet = new Set(["maths-ks4"]);
export const filterOutCoreTier = (
  legacy: boolean,
  subjectSlug?: string | null,
  keyStageSlug?: string | null,
  tiers?: TierSchema | null,
): TierSchema | null => {
  if (!subjectSlug || !keyStageSlug || !tiers) {
    return tiers || null;
  }
  const key = `${subjectSlug}-${keyStageSlug}`;
  return tiers.filter((tier) => {
    if (!hasCoreTierSet.has(key) || !legacy) {
      return tier.tierSlug !== "core";
    } else {
      return tier;
    }
  });
};
