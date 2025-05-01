import { z } from "zod";

import { lessonListItemSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

// we need a separate schema for the beta lesson listing page until
// we update the beta MV to align with the main lesson listing page

export const betaLessonListItemSchema = lessonListItemSchema.omit({
  isUnpublished: true,
});

export const betaLessonListSchema = z.array(betaLessonListItemSchema);
export type BetaLessonListSchema = z.infer<typeof betaLessonListSchema>;
