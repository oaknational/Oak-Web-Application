import { z } from "zod";

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
  type: z.literal("text"),
});

export type StemTextObject = z.infer<typeof stemTextObjectSchema>;

const stemImageObjectSchema = z.object({
  image_object: z.object({
    format: z.enum(["png", "jpg", "jpeg", "webp", "gif", "svg"]).optional(),
    secure_url: z.string().url(),
    url: z.string().url().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    metadata: z.union([z.array(z.any()), z.object({})]),
    public_id: z.string().optional(),
    version: z.number().optional(),
  }),
  type: z.literal("image"),
});

export type StemImageObject = z.infer<typeof stemImageObjectSchema>;

const mcAnswer = z.object({
  answer: z
    .array(z.union([stemTextObjectSchema, stemImageObjectSchema]))
    .min(1),
  answer_is_correct: z.boolean(),
});

export type MCAnswer = z.infer<typeof mcAnswer>;

const matchAnswer = z.object({
  correct_choice: z.array(stemTextObjectSchema).length(1),
  match_option: z.array(stemTextObjectSchema).length(1),
});

export type MatchAnswer = z.infer<typeof matchAnswer>;

const orderAnswer = z.object({
  answer: z.array(stemTextObjectSchema).length(1),
  correct_order: z.number(),
});

export type OrderAnswer = z.infer<typeof orderAnswer>;

const shortAnswer = z.object({
  answer: z.array(stemTextObjectSchema).length(1),
  answer_is_default: z.boolean(),
});

export type ShortAnswer = z.infer<typeof shortAnswer>;

const answersSchema = z.object({
  "multiple-choice": z.array(mcAnswer).nullable().optional(),
  match: z.array(matchAnswer).nullable().optional(),
  order: z.array(orderAnswer).nullable().optional(),
  "short-answer": z.array(shortAnswer).nullable().optional(),
  "explanatory-text": z.null().optional(),
});

export type AnswersSchema = z.infer<typeof answersSchema>;

export const lessonPathwaySchema = z.object({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
});

export const lessonOverviewQuizData = z
  .array(
    z.object({
      questionId: z.number(),
      questionUid: z.string(),
      questionType: z.enum([
        "multiple-choice",
        "match",
        "order",
        "short-answer",
        "explanatory-text",
      ]),
      questionStem: z
        .array(z.union([stemTextObjectSchema, stemImageObjectSchema]))
        .min(1),
      answers: answersSchema.nullable().optional(),
      feedback: z.string(),
      hint: z.string(),
      active: z.boolean(),
    }),
  )
  .nullable()
  .optional();

export type LessonOverviewQuizData = z.infer<typeof lessonOverviewQuizData>;

export const baseLessonOverviewSchema = z.object({
  isLegacy: z.boolean(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  tierTitle: z.string().nullable().optional(),
  tierSlug: z.string().nullable().optional(),
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
  isWorksheetLandscape: z.boolean().optional().nullable(),
  hasDownloadableResources: z.boolean(),
  hasCopyrightMaterial: z.boolean().optional().nullable(),
  expired: z.boolean().optional().nullable(),
  starterQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  videoTitle: z.string().nullish(),
});
export type LessonBase = z.infer<typeof baseLessonOverviewSchema>;

const lessonDownloadsListSchema = z.array(
  z.object({
    exists: z.boolean().nullable(),
    type: z.enum([
      "presentation",
      "intro-quiz-questions",
      "intro-quiz-answers",
      "exit-quiz-questions",
      "exit-quiz-answers",
      "worksheet-pdf",
      "worksheet-pptx",
      "supplementary-pdf",
      "supplementary-docx",
    ]),
    label: z.string(),
    ext: z.string(),
    forbidden: z.union([
      z.array(z.object({ copyright_info: z.string() })),
      z.boolean().optional().nullish(),
    ]),
  }),
);

export const baseLessonDownloadsSchema = z.object({
  isLegacy: z.boolean(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  downloads: lessonDownloadsListSchema,
});
