import { keysToCamelCase } from "zod-to-camel-case";

import {
  UnitListingBrowseData,
  unitBrowseDataSchema,
} from "./pupilUnitListing.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { applyGenericOverridesAndExceptions } from "@/node-lib/curriculum-api-2023/helpers/overridesAndExceptions";
import { PupilUnitListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";

export const pupilUnitListingQuery =
  (sdk: Sdk) =>
  async (args: { baseSlug: string }): Promise<UnitListingBrowseData> => {
    const { baseSlug } = args;

    const res = await sdk.pupilUnitListing({
      baseSlug,
    });
    res.browseData.forEach((item) => {
      item.actions = { ...item.actions, programme_field_overrides: {} };
    });
    const modifiedBrowseData = applyGenericOverridesAndExceptions<
      PupilUnitListingQuery["browseData"][number]
    >({
      journey: "pupil",
      queryName: "pupilUnitListingQuery",
      browseData: res.browseData,
    });

    if (modifiedBrowseData.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    unitBrowseDataSchema.parse(modifiedBrowseData);

    const browseData = keysToCamelCase(
      modifiedBrowseData,
    ) as UnitListingBrowseData;

    return browseData;
  };
