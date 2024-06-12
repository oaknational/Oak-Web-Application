import {
  PupilProgrammeListingData,
  pupilProgrammeListingSchema,
} from "./pupilProgrammeListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

/**
 *
 * Provide a list of possible synthetic programmes for a given base slug
 * The query must return either legacy or non-legacy programmes but can't return both
 *
 */

export const pupilProgrammeListingQuery =
  (sdk: Sdk) =>
  async ({
    baseSlug,
  }: {
    baseSlug: string;
  }): Promise<PupilProgrammeListingData[]> => {
    const res = await sdk.pupilProgrammeListing({
      baseSlug,
    });

    if (res.data?.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilProgrammeListingSchema.array().parse(res.data);

    return keysToCamelCase(res.data) as PupilProgrammeListingData[];
  };
