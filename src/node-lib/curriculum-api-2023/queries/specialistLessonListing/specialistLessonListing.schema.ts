import { z } from "zod";

const assetObjectSchema = z
  .object({
    google_drive: z.object({
      id: z.string(),
      url: z.string(),
    }),
    google_drive_downloadable_version: z.object({
      id: z.string(),
      url: z.string(),
    }),
  })
  .nullish();

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
    worksheet_asset_object: assetObjectSchema,
    worksheet_url: z.string().nullish(),
    video_mux_playback_id: z.string().nullish(),
    video_title: z.string().nullish(),
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
  orderInUnit: z.number().nullish(),
  hasCopyrightMaterial: z.boolean().nullish(),
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
