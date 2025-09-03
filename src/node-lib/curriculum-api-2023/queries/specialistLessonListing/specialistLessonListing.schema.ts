import { z } from "zod";

import { legacyAssetObjectSchema } from "../../shared.schema";

export const specialistLessonQueryResponseSchema = z.array(
  z.object({
    lesson_slug: z.string(),
    lesson_title: z.string(),
    combined_programme_fields: z.object({
      subject: z.string(),
      subject_slug: z.string(),
      developmentstage: z.string().nullish(),
      developmentstage_slug: z.string().nullish(),
    }),
    unit_slug: z.string(),
    unit_title: z.string(),
    expired: z.boolean().nullish(),
    contains_copyright_content: z.boolean(),
    exit_quiz: z.number().nullable(),
    starter_quiz: z.number().nullable(),
    pupil_lesson_outcome: z.string().nullish(),
    worksheet_asset_object: legacyAssetObjectSchema,
    worksheet_url: z.string().nullish(),
    video_mux_playback_id: z.string().nullish(),
    video_title: z.string().nullish(),
    order_in_unit: z.number(),
  }),
);

export const SpecialistLessonSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitSlug: z.string(),
  programmeSlug: z.string(),
  programmeTitle: z.string(),
  description: z.string(),
  expired: z.boolean(),
  pupilLessonOutcome: z.string().nullish(),
  quizCount: z.number().nullable(),
  videoCount: z.number().nullable(),
  presentationCount: z.number().nullable(),
  worksheetCount: z.number().nullable(),
  hasCurriculumDownload: z.boolean().nullish(),
  orderInUnit: z.number(),
  hasLegacyCopyrightMaterial: z.boolean().nullish(),
  developmentStageSlug: z.string().nullish(),
  developmentStageTitle: z.string().nullish(),
  developmentStage: z.string().nullish(),
  isUnpublished: z.literal(false),
});

export type SpecialistLesson = z.infer<typeof SpecialistLessonSchema>;

export const SpecialistLessonListingDataSchema = z.object({
  lessons: z.array(SpecialistLessonSchema),
  programmeSlug: z.string(),
  programmeTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
});

export type SpecialistLessonListingData = z.infer<
  typeof SpecialistLessonListingDataSchema
>;
