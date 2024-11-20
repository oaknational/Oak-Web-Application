import { z } from "zod";
import {
  keystageSlugs,
  keystageDescriptions,
  syntheticUnitvariantLessonsByKsSchemaOld,
} from "@oaknational/oak-curriculum-schema";

export const subjectSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
  programmeSlug: z.string(),
  programmeCount: z.number(),
});

const keyStageDataRaw = z.object({
  slug: keystageSlugs,
  description: keystageDescriptions,
  keystage: z.string(),
  display_order: z.number().optional(),
});

const keyStageSchema = z.object({
  slug: keystageSlugs,
  title: keystageDescriptions,
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const subjectListingSchema = z.object({
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  subjects: z.array(subjectSchema),
  keyStages: z.array(keyStageSchema),
});

export const subjectLisitingRawSchema = z.object({
  subjectLessons: z.array(
    syntheticUnitvariantLessonsByKsSchemaOld.omit({ unitvariant_id: true }),
  ),
  key_stages: z.array(keyStageDataRaw),
});

export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type KeyStageData = z.infer<typeof keyStageSchema>;
export default subjectListingSchema;
