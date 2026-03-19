import { z } from "zod";
import {
  syntheticUnitvariantsWithLessonIdsByYearsSchema,
  syntheticProgrammesByYearSchema,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const pupilsSitemapDataSchema = z.object({
  programmes: z.array(
    syntheticProgrammesByYearSchema.pick({
      programme_slug: true,
    }),
  ),
  units: z.array(
    syntheticUnitvariantsWithLessonIdsByYearsSchema.pick({
      programme_slug: true,
      unit_slug: true,
    }),
  ),
  lessons: z.array(
    syntheticUnitvariantLessonsSchema.pick({
      programme_slug: true,
      unit_slug: true,
      lesson_slug: true,
    }),
  ),
});

const pupilsSitemapDataCamel = zodToCamelCase(pupilsSitemapDataSchema);
export type PupilsSitemapBrowseData = z.infer<typeof pupilsSitemapDataCamel>;
