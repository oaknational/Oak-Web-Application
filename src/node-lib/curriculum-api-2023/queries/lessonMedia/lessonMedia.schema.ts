import { z } from "zod";

import { lessonPathwaySchema } from "../../shared.schema";

const baseLessonMediaSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
});

export const lessonMediaSchema = baseLessonMediaSchema.extend({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
});

export const canonicalLessonMediaSchema = baseLessonMediaSchema.extend({
  pathways: z.array(lessonPathwaySchema),
});

export type LessonMediaCanonical = z.infer<typeof canonicalLessonMediaSchema>;

export type LessonMediaData = z.infer<typeof lessonMediaSchema>;
