import {
  TeachersSitemapBrowseData,
  teachersSitemapDataSchema,
} from "./teacherSitemap.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import keysToCamelCase from "@/utils/snakeCaseConverter";

export type TeachersSitemap = {
  urls: string;
}[];

const teachersSitemap = (sdk: Sdk) => async () => {
  const res = await sdk.teachersSitemap();

  const sitemapData = res;

  if (
    !sitemapData ||
    sitemapData.keyStages.length === 0 ||
    sitemapData.programmes.length === 0 ||
    sitemapData.units.length === 0 ||
    sitemapData.lessons.length === 0 ||
    sitemapData.specialistProgrammes.length === 0 ||
    sitemapData.specialistUnits.length === 0 ||
    sitemapData.specialistLessons.length === 0
  ) {
    errorReporter("curriculum-api-2023::teachersSitemap")(
      new Error("Resource not found"),
      {
        severity: "warning",
        res,
      },
    );
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const teacherBrowseData = teachersSitemapDataSchema.parse({
    ...sitemapData,
  });

  const browseData = keysToCamelCase({
    ...teacherBrowseData,
  }) as TeachersSitemapBrowseData;
  return browseData;
};

export default teachersSitemap;
