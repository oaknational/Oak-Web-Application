import { z } from "zod";

import {
  baseLessonDownloadsSchema,
  lessonPathwaySchema,
} from "../../shared.schema";

export const lessonDownloadsSchema = z.intersection(
  baseLessonDownloadsSchema,
  lessonPathwaySchema,
);

export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;

export default lessonDownloadsSchema;
