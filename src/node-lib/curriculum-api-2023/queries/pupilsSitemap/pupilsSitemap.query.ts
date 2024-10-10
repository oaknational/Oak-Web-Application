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

    const { programmes, units, lessons } = res;

    const filteredUnits = units.filter(
      (unit) => !unit.actions?.exclusions.includes("pupils"),
    );

    const filteredLessons = lessons.filter(
      (lesson) => !lesson.actions?.exclusions.includes("pupils"),
    );

    const dataSnake = {
      programmes,
      units: filteredUnits,
      lessons: filteredLessons,
    };

    if (
      !dataSnake ||
      dataSnake.programmes.length === 0 ||
      dataSnake.units.length === 0 ||
      dataSnake.lessons.length === 0
    ) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    pupilsSitemapDataSchema.parse(dataSnake);

    const browseData = keysToCamelCase(dataSnake) as PupilsSitemapBrowseData;
    return browseData;
  };

export default pupilsSitemap;
