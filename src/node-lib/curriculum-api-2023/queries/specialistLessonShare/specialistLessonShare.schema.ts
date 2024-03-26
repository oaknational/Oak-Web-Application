import { z } from "zod";

import { lessonShareResourceSchema } from "../../shared.schema";

export const specialistLessonShareQueryResponseSchema = z.object({
  lesson_title: z.string(),
  unit_title: z.string(),
  expired: z.boolean().nullable(),
  worksheet_url: z.string().nullable(),
  starter_quiz: z.string().nullable(),
  exit_quiz: z.string().nullable(),
  video_mux_playback_id: z.string().nullish(),
  presentation_url: z.string().nullish(),
  synthetic_programme_slug: z.string(),
  combined_programme_fields: z.object({
    subject_slug: z.string(),
    subject: z.string(),
    developmentstage: z.string().nullish(),
  }),
});

export const specialistLessonShareSchema = z.object({
  isSpecialist: z.literal(true),
  developmentStageTitle: z.string().nullish(),
  programmeSlug: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  shareableResources: z.array(lessonShareResourceSchema),
  isLegacy: z.boolean(),
  expired: z.boolean().nullable(),
});

export type SpecialistLessonShareData = z.infer<
  typeof specialistLessonShareSchema
>;
