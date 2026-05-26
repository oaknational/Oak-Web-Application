import { z } from "zod";

export const teachersSitemapDataSchema = z.object({
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
});

export type TeachersSitemapDataSchemaSnake = z.infer<
  typeof teachersSitemapDataSchema
>;

export type TeachersSitemapBrowseData = {
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
