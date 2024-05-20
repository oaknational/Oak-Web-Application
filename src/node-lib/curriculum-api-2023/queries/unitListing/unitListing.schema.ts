import { z } from "zod";
import {
  examboardSlugs,
  examboards,
  keystageDescriptions,
  keystageSlugs,
  subjectSlugs,
  subjects,
  tierSlugs,
} from "@oaknational/oak-curriculum-schema";

import { tierSchema } from "./tiers/tiers.schema";
import { learningThemes } from "./threads/threads.schema";
import { unitSchema } from "./units/units.schema";

const unitListingData = z.object({
  programmeSlug: z.string(),
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  examBoardSlug: examboardSlugs.nullable(),
  examBoardTitle: examboards.nullable(),
  lessonCount: z.number().nullish(),
  subjectSlug: subjectSlugs,
  subjectTitle: subjects,
  tierSlug: tierSlugs.nullable(),
  totalUnitCount: z.number(),
  tiers: tierSchema,
  units: unitSchema,
  hasNewContent: z.boolean(),
  learningThemes: learningThemes,
});

export type UnitListingData = z.infer<typeof unitListingData>;
