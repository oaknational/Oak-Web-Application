import { z } from "zod";

import {
  legacyAssetObjectSchema,
  lessonDownloadsListSchema,
} from "../../shared.schema";

const specialistLessonDownloadRawSchema = z.object({
  lesson_title: z.string(),
  combined_programme_fields: z.object({
    subject: z.string(),
    subject_slug: z.string(),
    developmentstage: z.string().nullish(),
    developmentstage_slug: z.string().nullish(),
  }),
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
  exit_quiz_asset_object: legacyAssetObjectSchema,
  presentation_url: z.string().nullish(),
  starter_quiz_asset_object: legacyAssetObjectSchema,
  slidedeck_asset_object: legacyAssetObjectSchema,
});

export type SpecialistLessonDownloadRaw = z.infer<
  typeof specialistLessonDownloadRawSchema
>;

export const specialistLessonDownloadQueryResponseSchema = z.array(
  specialistLessonDownloadRawSchema,
);

export const SpecialistLessonDownloadSchema = z.object({
  lesson: z.object({
    subjectTitle: z.string(),
    subjectSlug: z.string(),
    unitTitle: z.string(),
    unitSlug: z.string(),
    programmeSlug: z.string(),
    isLegacy: z.boolean(),
    lessonTitle: z.string(),
    lessonSlug: z.string(),
    downloads: lessonDownloadsListSchema,
    nextLessons: z.array(
      z.object({
        lessonSlug: z.string(),
        lessonTitle: z.string(),
      }),
    ),
    hasDownloadableResources: z.boolean(),
    expired: z.boolean().nullable(),
  }),
});

export type SpecialistLessonDownloads = z.infer<
  typeof SpecialistLessonDownloadSchema
>;
export type SpecialistLessonDownloadsPageData = {
  curriculumData: SpecialistLessonDownloads;
};
