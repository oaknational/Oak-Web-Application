import {
  programmeFieldsSchema,
  tierDescriptions,
  tierSlugs,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

export const rawTierResponseSchema = z.array(
  z.object({
    programme_fields: programmeFieldsSchema,
    programme_slug: z.string(),
  }),
);

export const tierSchema = z.array(
  z.object({
    tierSlug: tierSlugs,
    tierTitle: tierDescriptions,
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullish(),
    lessonCount: z.number().nullish(),
    tierOrder: z.number().nullable(),
  }),
);

export type TierSchema = z.infer<typeof tierSchema>;
