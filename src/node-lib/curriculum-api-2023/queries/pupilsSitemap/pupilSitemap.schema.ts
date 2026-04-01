import { z } from "zod";
import {
  syntheticUnitvariantsWithLessonIdsByYearsSchema,
  syntheticProgrammesByYearSchema,
  syntheticUnitvariantLessonsSchema,
} from "@oaknational/oak-curriculum-schema";

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

export type PupilsSitemapBrowseData = {
  programmes: Array<{
    programmeSlug: string;
  }>;
  units: Array<{
    programmeSlug: string;
    unitSlug: string;
  }>;
  lessons: Array<{
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }>;
};
