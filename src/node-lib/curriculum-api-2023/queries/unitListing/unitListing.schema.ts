import { z } from "zod";
import {
  examboardSlugs,
  examboards,
  keystageDescriptions,
  keystageSlugs,
  phaseSlugs,
  subjectSlugs,
  subjects,
  tierSlugs,
  yearDescriptions,
  yearSlugs,
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
  subjectParent: subjects.nullable(),
  tierSlug: tierSlugs.nullable(),
  tiers: tierSchema,
  units: unitSchema,
  hasNewContent: z.boolean(),
  learningThemes: learningThemes,
  phase: phaseSlugs,
  yearGroups: z.array(
    z.object({ year: yearSlugs, yearTitle: yearDescriptions }),
  ),
  subjectCategories: z.array(
    z.object({
      iconName: z.string(),
      label: z.string(),
      slug: z.string(),
    }),
  ),
});

export type UnitListingData = z.infer<typeof unitListingData>;
