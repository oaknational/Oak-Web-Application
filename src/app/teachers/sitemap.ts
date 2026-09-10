import type { MetadataRoute } from "next";

import errorReporter from "@/common-lib/error-reporter";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { buildTeachersSitemapEntries } from "@/pages-helpers/teacher/sitemap-pages/sitemapPagesHelper";

export const revalidate = 7200;

const reportError = errorReporter("teachers-sitemap::app");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [data, subjects] = await Promise.all([
      curriculumApi2023.teachersSitemap(),
      curriculumApi2023.curriculumPhaseOptions({ includeNonCurriculum: true }),
    ]);

    return buildTeachersSitemapEntries(data, subjects);
  } catch (error) {
    await reportError(error, {});
    throw error;
  }
}
