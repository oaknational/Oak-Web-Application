import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  keystageSlugs,
  keystageDescriptions,
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

const subjectDataArrayRaw = z.array(syntheticUnitvariantLessonsSchema);

export const subjectLisitingRawSchema = z.object({
  subjectLessons: z.array(syntheticUnitvariantLessonsSchema),
  key_stages: z.array(keyStageDataRaw),
});

export type SubjectDataArrayRaw = z.infer<typeof subjectDataArrayRaw>;
export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type KeyStageData = z.infer<typeof keyStageSchema>;
export type SubjectListingRawData = z.infer<typeof subjectLisitingRawSchema>;
export default subjectListingSchema;
