import { z } from "zod";

const unitSchema = z.array(
  z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      programmeSlug: z.string(),
      keyStageSlug: z.string(),
      keyStageTitle: z.string(),
      subjectSlug: z.string(),
      subjectTitle: z.string(),
      lessonCount: z.number().nullable(),
      quizCount: z.number().nullable(),
      unitStudyOrder: z.number(),
      expired: z.boolean().nullable(),
      expiredLessonCount: z.number().nullable(),
      themeSlug: z.string().nullable(),
      themeTitle: z.string().nullable(),
    })
  )
);
const tierSchema = z.array(
  z.object({
    tierSlug: z.string(),
    tierTitle: z.string(),
    tierProgrammeSlug: z.string(),
    unitCount: z.number().nullable().optional(),
    lessonCount: z.number().nullable().optional(),
  })
);

const unitListingSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  examBoardSlug: z.string().nullable(),
  examBoardTitle: z.string().nullable(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullable(),
  totalUnitCount: z.number(),
  tiers: tierSchema,
  units: unitSchema,
  learningThemes: z.array(
    z.object({
      themeTitle: z.string().nullable(),
      themeSlug: z.string().nullable(),
    })
  ),
});

export type unitListingPageData = z.infer<typeof unitListingSchema>;

export default unitListingSchema;
