import {
  PupilsSitemapBrowseData,
  pupilsSitemapDataSchema,
} from "./pupilSitemap.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const pupilsSitemap =
  (sdk: Sdk) => async (): Promise<PupilsSitemapBrowseData> => {
    const res = await sdk.pupilsSitemap();

    const DataSnake = res;

    if (
      !DataSnake ||
      DataSnake.programmes.length === 0 ||
      DataSnake.units.length === 0 ||
      DataSnake.lessons.length === 0
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilsSitemapDataSchema.parse(DataSnake);

    const browseData = keysToCamelCase(DataSnake) as PupilsSitemapBrowseData;
    return browseData;
  };

export default pupilsSitemap;
