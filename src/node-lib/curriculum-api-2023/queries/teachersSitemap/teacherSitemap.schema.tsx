import { z } from "zod";
import {
  syntheticUnitvariantLessonsByKsSchema,
  keystageSlugs,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const teachersSitemapDataSchema = z.object({
  keyStages: z.array(keystageSlugs),
  programmes: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
    }),
  ),
  units: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
      unit_slug: true,
    }),
  ),
  lessons: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
      unit_slug: true,
      lesson_slug: true,
    }),
  ),

  specialistProgrammes: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
    }),
  ),

  specialistUnits: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
      unit_slug: true,
    }),
  ),
  specialistLessons: z.array(
    syntheticUnitvariantLessonsByKsSchema.pick({
      programme_slug: true,
      unit_slug: true,
      lesson_slug: true,
    }),
  ),
});

export type TeachersSitemapBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof teachersSitemapDataSchema>
>;
