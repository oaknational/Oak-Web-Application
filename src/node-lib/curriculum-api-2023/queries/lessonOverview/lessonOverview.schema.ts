import { z } from "zod";

import { baseLessonOverviewSchema } from "../../shared.schema";

export const lessonOverviewSchema = baseLessonOverviewSchema.extend({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  yearTitle: z.string().nullable().optional(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = baseLessonOverviewSchema;
