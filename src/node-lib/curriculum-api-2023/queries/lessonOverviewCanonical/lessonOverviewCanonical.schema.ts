import { z } from "zod";

import {
  baseLessonOverviewSchema,
  lessonPathwaySchema,
} from "../../shared.schema";
import { lessonOverviewDownloads } from "../lessonOverview/lessonOverview.schema";

export const lessonOverviewSchema = baseLessonOverviewSchema.extend({
  pathways: z.array(lessonPathwaySchema),
  downloads: lessonOverviewDownloads,
});

export type LessonOverviewCanonical = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = baseLessonOverviewSchema;
