import { z } from "zod";

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

const stemTextObjectSchema = z.object({
  text: z.string(),
  type: z.enum(["text"]),
});

export type StemTextObject = z.infer<typeof stemImageObjectSchema>;

const stemImageObjectSchema = z.object({
  image_object: z.object({
    format: z.enum(["png", "jpg", "jpeg", "webp", "gif", "svg"]),
    secure_url: z.string().url(),
    url: z.string(),
    height: z.number(),
    width: z.number(),
    metadata: z.object({}),
    public_id: z.string(),
    version: z.number(),
  }),
  type: z.enum(["image"]),
});

export type StemImageObject = z.infer<typeof stemImageObjectSchema>;

const mcAnswer = z.object({
  answer: z.array(z.union([stemTextObjectSchema, stemImageObjectSchema])),
  answer_is_correct: z.boolean(),
});

export type MCAnswer = z.infer<typeof mcAnswer>;

const answersSchema = z.object({
  "multiple-choice": z.array(mcAnswer).nullable().optional(),
  match: z
    .array(
      z.object({
        correct_choice: z.array(stemTextObjectSchema),
        match_option: z.array(stemTextObjectSchema),
      })
    )
    .nullable()
    .optional(),
  order: z
    .array(
      z.object({
        answer: z.array(stemTextObjectSchema),
        correct_order: z.number(),
      })
    )
    .nullable()
    .optional(),
  "short-answer": z
    .array(
      z.object({
        answer: z.array(stemTextObjectSchema),
        answer_is_default: z.boolean(),
      })
    )
    .nullable()
    .optional(),
});

export const lessonOverviewQuizData = z
  .array(
    z.object({
      questionId: z.number(),
      questionUid: z.string(),
      questionType: z.string(),
      questionStem: z.array(
        z.union([stemTextObjectSchema, stemImageObjectSchema])
      ),
      answers: answersSchema,
      feedback: z.string(),
      hint: z.string(),
      active: z.boolean(),
    })
  )
  .nullable()
  .optional();

export type LessonOverviewQuizData = z.infer<typeof lessonOverviewQuizData>;

export const lessonOverviewSchema = z.object({
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
  isWorksheetLandscape: z.boolean().optional().nullable(),
  hasDownloadableResources: z.boolean().optional().nullable(),
  hasCopyrightMaterial: z.boolean().optional().nullable(),
  yearTitle: z.string().nullable().optional(),
  starterQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  expired: z.boolean().optional().nullable(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;

export const baseLessonOverviewData = lessonOverviewSchema;
