import { z } from "zod";

import { tierSchema } from "./tiers/tiers.schema";
import { learningThemes } from "./threads/threads.schema";
import { unitSchema } from "./units/units.schema";

const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  lessonCount: z.number().nullish(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tierSchema,
  units: unitSchema,
  hasNewContent: z.boolean().nullish(),
  learningThemes: learningThemes.nullable(),
});

export type UnitListingData = z.infer<typeof unitListingData>;
