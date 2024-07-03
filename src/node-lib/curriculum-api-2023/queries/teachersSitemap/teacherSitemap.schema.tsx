import { z } from "zod";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

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

export type TeachersSitemapBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof teachersSitemapDataSchema>
>;
