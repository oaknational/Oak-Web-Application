import { z } from "zod";
import {
  keystageSlugs,
  keystageDescriptions,
  syntheticUnitvariantLessonsSchema,
  programmeFieldsSchema,
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

// temporary fix until reimplementation of this query
const partialPFSchema = programmeFieldsSchema.omit({
  pathway: true,
  pathway_slug: true,
  pathway_description: true,
  pathway_display_order: true,
  pathway_id: true,
});

export const subjectLisitingRawSchema = z.object({
  subjectLessons: z.array(
    syntheticUnitvariantLessonsSchema
      .omit({
        programme_fields: true,
        supplementary_data: true,
      })
      .merge(z.object({ programme_fields: partialPFSchema })),
  ),
  key_stages: z.array(keyStageDataRaw),
});

export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type KeyStageData = z.infer<typeof keyStageSchema>;
export default subjectListingSchema;
