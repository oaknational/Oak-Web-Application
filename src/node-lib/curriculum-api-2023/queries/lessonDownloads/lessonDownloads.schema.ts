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

export const lessonDownloadsSchema = z.object({
  ...baseLessonDownloadsSchema.shape,
  ...lessonPathwaySchema.shape,
  ...nextLessonSchema.shape,
  hasDownloadableResources: z.boolean().nullish(),
});

export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;
export type LessonListSchema = z.infer<typeof lessonListSchema>;
export type NextLessonSchema = z.infer<typeof nextLessonSchema>;
export type NextLesson = {
  lessonTitle: string;
  lessonSlug: string;
};

export default lessonDownloadsSchema;
