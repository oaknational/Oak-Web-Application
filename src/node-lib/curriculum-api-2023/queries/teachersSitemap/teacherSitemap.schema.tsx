import { z } from "zod";
import { keystageSlugs } from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const teachersSitemapDataSchema = z.object({
  keyStages: z.array(keystageSlugs),
  programmes: z.array(
    z.object({
      programme_slug: z.string(),
    }),
  ),
  units: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
    }),
  ),
  lessons: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
      lesson_slug: z.string(),
    }),
  ),

  specialistProgrammes: z.array(
    z.object({
      programme_slug: z.string(),
    }),
  ),

  specialistUnits: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
    }),
  ),
  specialistLessons: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
      lesson_slug: z.string(),
    }),
  ),
});

export type TeachersSitemapBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof teachersSitemapDataSchema>
>;
