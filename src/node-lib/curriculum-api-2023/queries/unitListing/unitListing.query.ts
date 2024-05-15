import { syntheticUnitvariantLessonsSchema } from "@oaknational/oak-curriculum-schema";

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

    const programme = res.programme;

    if (!programme || programme.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const parsedProgramme = programme.map((p) =>
      syntheticUnitvariantLessonsSchema.parse(p),
    );

    const programmeFields = parsedProgramme[0]?.programme_fields;
    if (!programmeFields) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const hasTiers = parsedProgramme.some(
      (p) => p.programme_fields.tier_slug !== null,
    );

    const tiers = hasTiers
      ? await getTiersForProgramme(
          sdk,
          programmeFields.subject_slug,
          programmeFields.keystage_slug,
          programmeFields.examboard_slug,
        )
      : [];

    return {
      programmeSlug: args.programmeSlug,
      keyStageSlug: programmeFields.keystage_slug,
      keyStageTitle: programmeFields.keystage_description,
      examBoardSlug: programmeFields.examboard_slug,
      examBoardTitle: programmeFields.examboard_description,
      subjectSlug: programmeFields.subject_slug,
      subjectTitle: programmeFields.subject_description,
      totalUnitCount: parsedProgramme.length,
      tierSlug: programmeFields.tier_slug,
      tiers: tiers, // TODO: core tier
      units: [], // TODO: units
    };
  };

export default unitListingQuery;
