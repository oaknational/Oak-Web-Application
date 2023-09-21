import { z } from "zod";

import {
  baseLessonDownloadsSchema,
  lessonPathwaySchema,
} from "../../shared.schema";

export const lessonDownloadsCanonicalSchema = baseLessonDownloadsSchema.extend({
  pathways: z.array(lessonPathwaySchema),
});

export type LessonDownloadsCanonical = z.infer<
  typeof lessonDownloadsCanonicalSchema
>;

export default lessonDownloadsCanonicalSchema;
