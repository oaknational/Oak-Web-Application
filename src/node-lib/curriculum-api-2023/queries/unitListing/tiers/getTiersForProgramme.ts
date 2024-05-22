import { isTierValid } from "../../../helpers";
import { Sdk } from "../../../sdk";

import { TierSchema, rawTierResponseSchema, tierSchema } from "./tiers.schema";

import OakError from "@/errors/OakError";

export const getTiersForProgramme = async (
  sdk: Sdk,
  subject: string,
  keystage: string,
  examboard: string | null,
  isLegacy: boolean,
) => {
  const contains: Record<string, string> = {
    subject_slug: subject,
    keystage_slug: keystage,
  };
  if (examboard) {
    contains.examboard_slug = examboard;
  }
  const response = await sdk.tiers({ _contains: contains, isLegacy: isLegacy });

  const rawTiers = response.tiers;
  if (!rawTiers || rawTiers.length === 0) {
    throw new OakError({
      code: "curriculum-api/not-found",
      originalError: `Missing tier data for ${
        isLegacy ? "legacy" : "non-legacy"
      } subject: ${subject} and keystage: ${keystage}`,
    });
  }

  const parsedTiersResponse = rawTierResponseSchema.parse(rawTiers);

  const constructedTiers = parsedTiersResponse.reduce(
    (acc, programme) => {
      const tierSlug = programme.programme_fields.tier_slug;
      const tierTitle = programme.programme_fields.tier_description;
      if (!tierSlug || !tierTitle) {
        return acc;
      }
      if (isTierValid(isLegacy, tierSlug, subject, keystage)) {
        if (!acc[tierSlug]) {
          acc[tierSlug] = {
            tierSlug,
            tierTitle,
            tierProgrammeSlug: programme.programme_slug,
            tierOrder: programme.programme_fields.tier_display_order,
          };
        }
      }

      return acc;
    },
    {} as Record<string, Partial<TierSchema[number]>>,
  );

  const parsedCompleteTiers = tierSchema.parse(Object.values(constructedTiers));
  const sortedTiers = parsedCompleteTiers.sort(
    (a, b) => (a.tierOrder ?? 0) - (b.tierOrder ?? 0),
  );
  return sortedTiers;
};
