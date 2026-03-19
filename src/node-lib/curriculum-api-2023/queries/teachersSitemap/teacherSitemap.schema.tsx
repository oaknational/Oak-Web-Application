import { z } from "zod";

import zodToCamelCase from "zod-to-camel-case";

export const teachersSitemapDataSchema = z.object({
  keyStages: z.array(
    z.object({
      slug: z.string(),
    }),
  ),
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

export type TeachersSitemapDataSchemaSnake = z.infer<
  typeof teachersSitemapDataSchema
>;

const teachersSitemapDataCamel = zodToCamelCase(teachersSitemapDataSchema);
export type TeachersSitemapBrowseData = z.infer<
  typeof teachersSitemapDataCamel
>;
