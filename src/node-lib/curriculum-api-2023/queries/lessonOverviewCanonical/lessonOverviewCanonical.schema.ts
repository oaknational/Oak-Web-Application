import { z } from "zod";

import {
  baseLessonOverviewSchema,
  lessonPathwaySchema,
} from "../../shared.schema";

export const lessonOverviewSchema = baseLessonOverviewSchema.extend({
  pathways: z.array(lessonPathwaySchema),
});

export type LessonOverviewCanonical = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = baseLessonOverviewSchema;
