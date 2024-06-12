import {
  PupilSubjectListingData,
  pupilSubjectListingSchema,
} from "./pupilSubjectListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

/**
 *
 * Provide a list of possible synthetic programmes for a given year slug
 * The query must return either legacy or non-legacy programmes but can't return both
 *
 */

export const pupilSubjectListingQuery =
  (sdk: Sdk) =>
  async ({
    yearSlug,
  }: {
    yearSlug: string;
  }): Promise<PupilSubjectListingData[]> => {
    const res = await sdk.pupilSubjectListing({
      yearSlug,
    });

    if (res.data?.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilSubjectListingSchema.array().parse(res.data);

    return keysToCamelCase(res.data) as PupilSubjectListingData[];
  };
