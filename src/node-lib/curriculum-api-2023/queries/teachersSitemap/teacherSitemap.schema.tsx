import { z } from "zod";

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

export type TeachersSitemapBrowseData = {
  keyStages: Array<{
    slug: string;
  }>;
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
  specialistProgrammes: Array<{
    programmeSlug: string;
  }>;
  specialistUnits: Array<{
    programmeSlug: string;
    unitSlug: string;
  }>;
  specialistLessons: Array<{
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }>;
};
