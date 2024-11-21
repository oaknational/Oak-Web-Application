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
  subjects: z.array(subjectSchema),
  keyStageSlug: keystageSlugs,
  keyStageTitle: keystageDescriptions,
  keyStages: z.array(keyStageSchema),
});

export const subjectLisitingRawSchema = z.object({
  subjectLessons: z.array(
    syntheticUnitvariantLessonsSchema
      .omit({
        programme_fields: true,
        supplementary_data: true,
      })
      .merge(z.object({ programme_fields: programmeFieldsSchema })),
  ),
  key_stages: z.array(keyStageDataRaw),
});

export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type KeyStageData = z.infer<typeof keyStageSchema>;
export default subjectListingSchema;
