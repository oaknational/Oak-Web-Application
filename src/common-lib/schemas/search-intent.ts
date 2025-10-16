import { z } from "zod";
import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

export const intentRequestSchema = z.object({
  v: z.enum(["1"]),
  searchTerm: z.string().min(2).max(250),
});

export const directMatchSchema = z.object({
  subject: z
    .object({
      slug: subjectSlugs,
      title: z.string(),
    })
    .nullable(),
  keyStage: z
    .object({
      slug: keystageSlugs,
      title: z.string(),
    })
    .nullable(),
  year: z
    .object({
      slug: yearSlugs,
      title: z.string(),
    })
    .nullable(),
  examBoard: z
    .object({
      slug: examboardSlugs,
      title: z.string(),
    })
    .nullable(),
});

export type DirectMatch = z.infer<typeof directMatchSchema>;

export const suggestedFilterSchema = z.union([
  z.object({
    type: z.literal("subject"),
    slug: subjectSlugs,
    title: z.string(),
  }),
  z.object({
    type: z.literal("key-stage"),
    slug: keystageSlugs,
    title: z.string(),
  }),
  z.object({
    type: z.literal("year"),
    slug: yearSlugs,
    title: z.string(),
  }),
  z.object({
    type: z.literal("exam-board"),
    slug: examboardSlugs,
    title: z.string(),
  }),
]);
export type SuggestedFilter = z.infer<typeof suggestedFilterSchema>;

export const searchIntentSchema = z.object({
  directMatch: directMatchSchema.nullable(),
  suggestedFilters: z.array(suggestedFilterSchema),
});

export type SearchIntent = z.infer<typeof searchIntentSchema>;
