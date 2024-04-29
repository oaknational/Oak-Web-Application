import {
  UnitListingBrowseData,
  unitBrowseDataSchema,
} from "./pupilUnitListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export const pupilUnitListingQuery =
  (sdk: Sdk) =>
  async (args: { programmeSlug: string }): Promise<UnitListingBrowseData> => {
    const { programmeSlug } = args;

    const res = await sdk.pupilUnitListing({
      programmeSlug,
    });

    const browseDataSnake = res.browseData;

    if (!browseDataSnake) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    unitBrowseDataSchema.parse(browseDataSnake);

    const browseData = keysToCamelCase(
      browseDataSnake,
    ) as UnitListingBrowseData;
    return browseData;
  };
