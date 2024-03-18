import { z } from "zod";

import { lessonShareResourceSchema } from "../../shared.schema";

export const lessonShareSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  lessonCohort: z.string().nullish(),
  shareableResources: z.array(lessonShareResourceSchema),
  isLegacy: z.boolean(),
  expired: z.boolean().nullable(),
});

export type LessonShareData = z.infer<typeof lessonShareSchema>;
export type LessonShareResourceData = z.infer<typeof lessonShareResourceSchema>;
