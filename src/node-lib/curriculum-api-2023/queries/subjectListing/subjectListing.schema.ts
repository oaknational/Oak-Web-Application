import { z } from "zod";

export const subjectSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
  programmeSlug: z.string(),
  programmeCount: z.number(),
});

const keyStageDataRaw = z.object({
  slug: z.string(),
  description: z.string(),
  keystage: z.string(),
  display_order: z.number().optional(),
});

const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const subjectListingSchema = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjects: z.array(subjectSchema),
  keyStages: z.array(keyStageSchema),
});

const subjectDataRaw = z.object({
  programme_fields: z.object({
    subject: z.string(),
    subject_slug: z.string(),
    tier_slug: z.string().nullable(),
    year_slug: z.string().nullable(),
    keystage_slug: z.string(),
    keystage_description: z.string(),
  }),
  programme_slug: z.string(),
  is_legacy: z.boolean(),
});

export const subjectLisitingRawSchema = z.object({
  subjects: z.array(subjectDataRaw),
  key_stages: z.array(keyStageDataRaw),
});
// change
export const subjectUnitsAndLessonCountSchema = z.object({
  unitCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  lessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});

export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type KeyStageData = z.infer<typeof keyStageSchema>;
export type SubjectListingRawData = z.infer<typeof subjectLisitingRawSchema>;
export default subjectListingSchema;
