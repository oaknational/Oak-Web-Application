import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

export const rawTierResponseSchema = z.array(
  z.object({
    programme_fields: programmeFieldsSchema,
    programme_slug: z.string(),
  }),
);

const aggregateSchema = z.object({
  count: z.number(),
});

export const tierCounts = z.object({
  lessonCount: z.object({
    aggregate: aggregateSchema,
    nodes: z.array(z.object({ programme_fields: z.string() })),
  }),
  unitCount: z.object({
    aggregate: aggregateSchema,
    nodes: z.array(z.object({ programme_fields: z.string() })),
  }),
});

export type TierCounts = z.infer<typeof tierCounts>;

export const tierSchema = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullish(),
    lessonCount: z.number().nullish(),
    tierOrder: z.number().nullable(),
  }),
);

export type TierSchema = z.infer<typeof tierSchema>;
