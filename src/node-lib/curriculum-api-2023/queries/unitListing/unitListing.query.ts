import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "../../../../errors/OakError";
import { Sdk, getBatchedRequests } from "../../sdk";
import { TierCountsDocument } from "../../generated/sdk";

import {
  TierSchema,
  tierSchema,
  batchResultResponseArray,
  rawTierResponseSchema,
} from "./unitListing.schema";

export const getTiersForProgramme = async (
  sdk: Sdk,
  subject: string,
  keystage: string,
  examboard: string | null,
) => {
  const contains: Record<string, string> = {
    subject_slug: subject,
    keystage_slug: keystage,
  };
  if (examboard) {
    contains.examboard_slug = examboard;
  }
  const response = await sdk.tiers({ _contains: contains });
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
      if (!acc[tierSlug]) {
        acc[tierSlug] = {
          tierSlug,
          tierTitle,
          tierProgrammeSlug: programme.programme_slug,
        };
      }
      return acc;
    },
    {} as Record<string, Partial<TierSchema[number]>>,
  );

  const batchRequests = Object.keys(constructedTiers).map((c) => {
    const variables: Record<string, string> = {
      subjectSlug: subject,
      tierSlug: c,
      keystageSlug: keystage,
    };
    if (examboard) {
      variables.examboardSlug = examboard;
    }
    return {
      document: TierCountsDocument,
      variables: { _contains: variables },
    };
  });

  const batchResponse = await getBatchedRequests(batchRequests);

  const parsedData = batchResultResponseArray.parse(batchResponse);

  parsedData.forEach((counts) => {
    const unitCount = counts.data.unitCount.aggregate.count;
    const lessonCount = counts.data.lessonCount.aggregate.count;

    const tierSlug = counts.data.unitCount.nodes[0]?.programme_fields;
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

  return parsedCompleteTiers;
};

const unitListingQuery =
  (sdk: Sdk) => async (args: { programmeSlug: string }) => {
    const res = await sdk.unitListing(args);

    const [programme] = res.programme;

    if (!programme) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.programme.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    const isLegacy = programme.programmeSlug?.endsWith("-l") ?? false;

    return unitListingSchema.parse({
      ...programme,
      tiers:
        programme.tiers &&
        filterOutCoreTier(
          isLegacy,
          programme.subjectSlug,
          programme.keyStageSlug,
          programme.tiers,
        ),
      keyStageTitle:
        programme.keyStageTitle && toSentenceCase(programme.keyStageTitle),
    });
  };

export default unitListingQuery;
