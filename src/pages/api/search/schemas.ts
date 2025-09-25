import { z } from "zod";
import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

export const intentRequestSchema = z.object({
  searchTerm: z.string().min(2).max(250),
});

export const directMatchSchema = z.object({
  subject: subjectSlugs.nullable(),
  keyStage: keystageSlugs.nullable(),
  year: yearSlugs.nullable(),
  examBoard: examboardSlugs.nullable(),
});

export const aiResponseSchema = z.object({
  subjects: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(1).max(5),
    }),
  ),
});
export type AIResponse = z.infer<typeof aiResponseSchema>;

export const suggestedFilterSchema = z.union([
  z.object({
    type: z.literal("subject"),
    value: subjectSlugs,
  }),
  z.object({
    type: z.literal("key-stage"),
    value: keystageSlugs,
  }),
  z.object({
    type: z.literal("year"),
    value: yearSlugs,
  }),
  z.object({
    type: z.literal("exam-board"),
    value: examboardSlugs,
  }),
]);

export const searchIntentSchema = z.object({
  directMatch: directMatchSchema.nullable(),
  suggestedFilters: z.array(suggestedFilterSchema),
});
