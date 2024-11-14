import { z } from "zod";

import { copyrightContentSchema } from "../../shared.schema";

const specialistLessonMediaRawSchema = z.object({
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
});

export type SpecialistLessonMediaRaw = z.infer<
  typeof specialistLessonMediaRawSchema
>;

export const specialistLessonMediaQueryResponseSchema = z.array(
  specialistLessonMediaRawSchema,
);

export const SpecialistLessonMediaSchema = z.object({
  lesson: z.object({
    updatedAt: z.string(),
    isSpecialist: z.literal(true),
    subjectTitle: z.string(),
    subjectSlug: z.string(),
    unitTitle: z.string(),
    unitSlug: z.string(),
    developmentStageTitle: z.string().nullish(),
    programmeSlug: z.string(),
    isLegacy: z.boolean(),
    lessonTitle: z.string(),
    lessonSlug: z.string(),
    expired: z.boolean().nullable(),
    copyrightContent: copyrightContentSchema,
    geoRestricted: z.boolean().nullable(),
    loginRequired: z.boolean().nullable(),
  }),
});

export type SpecialistLessonMedia = z.infer<typeof SpecialistLessonMediaSchema>;
export type SpecialistLessonMediaPageData = {
  curriculumData: SpecialistLessonMedia;
};
