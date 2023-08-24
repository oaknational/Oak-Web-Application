import { z } from "zod";

// OLD SCHEMA
export const lessonOverviewQuizData = z.array(
  z.object({
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    order: z.number().nullable().optional(),
    title: z.string().nullable().optional(),
    points: z.number().nullable().optional(),
    required: z.boolean().nullable(),
    choices: z.array(
      z.object({
        choice: z.string(),
        image: z.string().nullable(),
      })
    ),
    active: z.boolean(),
    answer: z.union([z.array(z.string()), z.string()]),
    type: z.string(),
    quizType: z.string(),
    images: z
      .array(
        z.union([
          z.object({
            title: z.string().nullable(),
            images: z.array(z.string()),
          }),
          z.string(),
        ])
      )
      .nullable(),
    feedbackCorrect: z.string().nullable(),
    feedbackIncorrect: z.string().nullable(),
    displayNumber: z.string().nullable(),
  })
);

export const lessonQuizInfoData = z
  .object({
    title: z.string(),
    questionCount: z.number(),
  })
  .nullable();

// NEW SCHEMA

const contentGuidanceSchema = z.object({
  contentGuidanceLabel: z.string(),
  contentGuidanceDescription: z.string(),
  contentGuidanceArea: z.string(),
});

const misconceptionsAndCommonMistakesSchema = z.object({
  misconception: z.string(),
  response: z.string(),
});

const teacherTipsSchema = z.object({
  teacherTip: z.string(),
});

const lessonEquipmentAndResourcesSchema = z.object({
  equipment: z.string(),
});

const keyLearningPointsSchema = z.object({
  keyLearningPoint: z.string().nullable(),
});

const copyrightContentSchema = z.object({
  copyrightInfo: z.string(),
});

const keywordsSchema = z.object({
  keyword: z.string(),
  description: z.string(),
});

export const baseLessonOverviewData = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  contentGuidance: z.array(contentGuidanceSchema).nullable().optional(),
  misconceptionsAndCommonMistakes: z
    .array(misconceptionsAndCommonMistakesSchema)
    .nullable()
    .optional(),
  teacherTips: z.array(teacherTipsSchema).nullable().optional(),
  lessonEquipmentAndResources: z
    .array(lessonEquipmentAndResourcesSchema)
    .nullable()
    .optional(),
  additionalMaterialUrl: z.string().nullable(),
  keyLearningPoints: z.array(keyLearningPointsSchema).nullable().optional(),
  pupilLessonOutcome: z.string().nullable().optional(),
  lessonKeywords: z.array(keywordsSchema).nullable().optional(),
  copyrightContent: z.array(copyrightContentSchema).nullable().optional(),
  supervisionLevel: z.string().nullable(),
  worksheetUrl: z.string().nullable(),
  presentationUrl: z.string().nullable(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcriptSentences: z.array(z.string()).nullable(),
  isWorksheetLandscape: z.boolean(),
  hasDownloadableResources: z.boolean().nullable(),
  hasCopyrightMaterial: z.boolean(),
  yearTitle: z.string().nullable().optional(),
});

const lessonOverviewSchema = baseLessonOverviewData.extend({
  introQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  introQuizInfo: lessonQuizInfoData,
  exitQuizInfo: lessonQuizInfoData,
  expired: z.boolean(),
  hasCopyrightMaterial: z.boolean(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;
