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

    // TODO abstract this into a generic helper function
    const filtered = res.data.filter(
      (b) =>
        !b.actions?.exclusions?.includes("pupils") &&
        !b.actions?.exclusions?.includes("pupilProgrammeListingQuery"),
    );

    const modified = filtered.map((p) => {
      if (
        p?.actions?.programme_field_overrides &&
        !p?.actions?.opt_out.includes("pupils") &&
        !p?.actions?.opt_out.includes("pupilProgrammeListingQuery")
      ) {
        return {
          ...p,
          programme_fields: {
            ...p.programme_fields,
            ...p.actions.programme_field_overrides,
          },
        };
      }
      return p;
    });

    pupilProgrammeListingSchema.array().parse(modified);

    return keysToCamelCase(modified) as PupilProgrammeListingData[];
  };
