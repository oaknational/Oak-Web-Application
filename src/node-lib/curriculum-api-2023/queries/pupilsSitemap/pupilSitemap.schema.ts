import { z } from "zod";
import {
  syntheticUnitvariantsWithLessonIdsByYearsSchema,
  syntheticProgrammesByYearSchema,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

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

export type PupilsSitemapBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof pupilsSitemapDataSchema>
>;
