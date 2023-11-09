import { z } from "zod";

import {
  baseLessonDownloadsSchema,
  lessonListSchema,
  lessonPathwaySchema,
} from "../../shared.schema";

export const nextLessonSchema = z.object({
  nextLessons: z.array(
    z.object({ lessonSlug: z.string(), lessonTitle: z.string() }),
  ),
});

export const lessonDownloadsSchema = z.intersection(
  baseLessonDownloadsSchema,
  lessonPathwaySchema,
  nextLessonSchema,
);

export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;
export type LessonListSchema = z.infer<typeof lessonListSchema>;

export default lessonDownloadsSchema;
