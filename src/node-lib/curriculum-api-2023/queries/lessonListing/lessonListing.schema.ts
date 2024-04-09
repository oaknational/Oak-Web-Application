import { z } from "zod";

import { lessonListSchema } from "../../shared.schema";

const lessonListingSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  yearTitle: z.string().nullish(),
  lessons: lessonListSchema,
});

export type lessonListingSchema = z.infer<typeof lessonListingSchema>;

export type LessonListingPageData = z.infer<typeof lessonListingSchema>;

export default lessonListingSchema;
