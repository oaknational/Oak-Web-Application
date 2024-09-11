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
} from "@oaknational/oak-curriculum-schema";

import { tierSchema } from "./tiers/tiers.schema";
import { learningThemes } from "./threads/threads.schema";
import { unitSchema } from "./units/units.schema";

enum IconName {
  Grammar = "Grammar",
  Handwriting = "Handwriting",
  ReadingWritingOracy = "Reading, writing & oracy",
  Spelling = "Spelling",
  Vocabulary = "Vocabulary",
  Physics = "Physics",
  Biology = "Biology",
  Chemistry = "Chemistry",
}
const iconNameValues = Object.values(IconName) as [string, ...string[]];

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
  subjectCategories: z.array(
    z.object({
      iconName: z.enum(iconNameValues),
      label: z.string(),
      slug: z.string(),
    }),
  ),
});

export type UnitListingData = z.infer<typeof unitListingData>;
