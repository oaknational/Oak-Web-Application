import { TierCountsDocument } from "../../generated/sdk";
import { isTierValid } from "../../helpers";
import { Sdk, getBatchedRequests } from "../../sdk";

import {
  TierSchema,
  rawTierResponseSchema,
  tierCounts,
  tierSchema,
} from "./unitListing.schema";

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
    throw new OakError({ code: "curriculum-api/not-found" });
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

  const batchRequests = Object.keys(constructedTiers).map((c) => {
    const variables: Record<string, string> = {
      subject_slug: subject,
      tier_slug: c,
      keystage_slug: keystage,
    };
    if (examboard) {
      variables.examboard_slug = examboard;
    }
    return {
      document: TierCountsDocument,
      variables: { _contains: variables },
    };
  });

  const batchResponse = await getBatchedRequests(batchRequests);
  const data = batchResponse.map((b) => b.data);

  const parsedData = data.map((d) => tierCounts.parse(d));

  parsedData.forEach((counts) => {
    const unitCount = counts.unitCount.aggregate.count;
    const lessonCount = counts.lessonCount.aggregate.count;
    const tierSlug = counts.unitCount.nodes[0]?.programme_fields;

    if (
      !tierSlug ||
      !constructedTiers[tierSlug] ||
      !constructedTiers[tierSlug]
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    constructedTiers[tierSlug]!.unitCount = unitCount;
    constructedTiers[tierSlug]!.lessonCount = lessonCount;
  });

  const parsedCompleteTiers = tierSchema.parse(Object.values(constructedTiers));
  const sortedTiers = parsedCompleteTiers.sort(
    (a, b) => (a.tierOrder ?? 0) - (b.tierOrder ?? 0),
  );
  return sortedTiers;
};
