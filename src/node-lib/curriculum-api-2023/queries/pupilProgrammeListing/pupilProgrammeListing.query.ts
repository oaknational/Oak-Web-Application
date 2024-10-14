import {
  PupilProgrammeListingData,
  pupilProgrammeListingSchema,
} from "./pupilProgrammeListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { PupilProgrammeListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
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

    const modified = applyGenericOverridesAndExceptions<
      PupilProgrammeListingQuery["data"][number]
    >({
      journey: "pupil",
      queryName: "pupilProgrammeListingQuery",
      browseData: res.data,
    });

    if (modified.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilProgrammeListingSchema.array().parse(modified);

    return keysToCamelCase(modified) as PupilProgrammeListingData[];
  };
