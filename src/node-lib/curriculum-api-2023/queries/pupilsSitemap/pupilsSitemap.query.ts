import {
  PupilsSitemapBrowseData,
  pupilsSitemapDataSchema,
} from "./pupilSitemap.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const pupilsSitemap = (sdk: Sdk) => async () => {
  const res = await sdk.pupilsSitemap();

  const DataSnake = res;

  if (!DataSnake) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  pupilsSitemapDataSchema.parse(DataSnake);

  const browseData = keysToCamelCase(DataSnake) as PupilsSitemapBrowseData;
  return browseData;
};

export default pupilsSitemap;
