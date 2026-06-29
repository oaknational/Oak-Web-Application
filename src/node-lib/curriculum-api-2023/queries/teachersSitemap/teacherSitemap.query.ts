import { keysToCamelCase } from "zod-to-camel-case";

import {
  TeachersSitemapBrowseData,
  teachersSitemapDataSchema,
} from "./teacherSitemap.schema";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

export type TeachersSitemap = {
  urls: string;
}[];

const teachersSitemap = (sdk: Sdk) => async () => {
  const sitemapData = await sdk.teachersSitemap();

  if (!sitemapData.lessons.length) {
    errorReporter("curriculum-api-2023::teachersSitemap")(
      new Error("Resource not found"),
      {
        severity: "warning",
        sitemapData,
      },
    );
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const teacherBrowseData = teachersSitemapDataSchema.parse(sitemapData);
  const { programmeFilterUnits, ...browseData } = teacherBrowseData;

  return {
    ...keysToCamelCase(browseData),
    programmeFilterUnits: programmeFilterUnits.map((unit) => {
      const { actions, ...rest } = unit;

      return {
        ...keysToCamelCase(rest),
        actions,
      };
    }),
  } as TeachersSitemapBrowseData;
};

export default teachersSitemap;
