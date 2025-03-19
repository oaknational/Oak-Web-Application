import { z } from "zod";
import { actionsSchema } from "@oaknational/oak-curriculum-schema";

import { zodToCamelCase } from "./helpers/zodToCamelCase";
import { mediaClipsRecordCamelSchema } from "./queries/lessonMediaClips/lessonMediaClips.schema";

export const contentGuidanceSchemaCamelCase = z.object({
  contentGuidanceLabel: z.string(),
  contentGuidanceDescription: z.string(),
  contentGuidanceArea: z.string(),
});

export const misconceptionsAndCommonMistakesSchema = z.object({
  misconception: z.string(),
  response: z.string(),
});

export const teacherTipsSchema = z.object({
  teacherTip: z.string(),
});

export const lessonEquipmentAndResourcesSchema = z.object({
  equipment: z.string(),
});

export const keyLearningPointsSchema = z.object({
  keyLearningPoint: z.string().nullable(),
});

export type keyLearningPoint = z.infer<typeof keyLearningPointsSchema>;

export const copyrightContentSchema = z
  .array(
    z.object({
      copyrightInfo: z.string(),
    }),
  )
  .nullable()
  .optional();

export type CopyrightContent = z.infer<typeof copyrightContentSchema>;

export const keywordsSchema = z.object({
  keyword: z.string(),
  description: z.string(),
});

const stemTextObjectSchema = z.object({
  text: z.string(),
  type: z.literal("text"),
});

export type StemTextObject = z.infer<typeof stemTextObjectSchema>;

const stemImageObjectSchema = z.object({
  imageObject: z.object({
    format: z.enum(["png", "jpg", "jpeg", "webp", "gif", "svg"]).optional(),
    secureUrl: z.string().url(),
    url: z.string().url().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    metadata: z.union([
      z.array(z.any()),
      z.object({
        attribution: z.string().optional(),
        usageRestriction: z.string().optional(),
      }),
    ]),
    publicId: z.string().optional(),
    version: z.number().optional(),
  }),
  type: z.literal("image"),
});

export type StemImageObject = z.infer<typeof stemImageObjectSchema>;

export type StemObject = StemTextObject | StemImageObject;

const mcAnswer = z.object({
  answer: z
    .array(z.union([stemTextObjectSchema, stemImageObjectSchema]))
    .min(1),
  answerIsCorrect: z.boolean(),
});

export type MCAnswer = z.infer<typeof mcAnswer>;

const matchAnswer = z.object({
  correctChoice: z.array(stemTextObjectSchema).length(1),
  matchOption: z.array(stemTextObjectSchema).length(1),
});

export type MatchAnswer = z.infer<typeof matchAnswer>;

const orderAnswer = z.object({
  answer: z.array(stemTextObjectSchema).length(1),
  correctOrder: z.number(),
});

export type OrderAnswer = z.infer<typeof orderAnswer>;

const shortAnswer = z.object({
  answer: z.array(stemTextObjectSchema).length(1),
  answerIsDefault: z.boolean(),
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
  lessonCohort: z.string().nullish(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  yearGroupSlug: z.string().nullish(),
  yearGroupTitle: z.string().nullish(),
});

export type LessonPathway = z.infer<typeof lessonPathwaySchema>;

export const lessonOverviewQuizQuestionSchema = z.object({
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
});

export type LessonOverviewQuizQuestion = z.infer<
  typeof lessonOverviewQuizQuestionSchema
>;

export const lessonOverviewQuizData = z
  .array(lessonOverviewQuizQuestionSchema)
  .nullable()
  .optional();

export type LessonOverviewQuizData = z.infer<typeof lessonOverviewQuizData>;

export const camelActionSchema = zodToCamelCase(actionsSchema);

export type Actions = z.infer<typeof camelActionSchema>;

export const baseLessonOverviewSchema = z.object({
  isLegacy: z.boolean(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  tierTitle: z.string().nullable().optional(),
  tierSlug: z.string().nullable().optional(),
  contentGuidance: z
    .array(contentGuidanceSchemaCamelCase)
    .nullable()
    .optional(),
  misconceptionsAndCommonMistakes: z
    .array(misconceptionsAndCommonMistakesSchema)
    .nullable()
    .optional(),
  teacherTips: z.array(teacherTipsSchema).nullable().optional(),
  lessonEquipmentAndResources: z
    .array(lessonEquipmentAndResourcesSchema)
    .nullable()
    .optional(),
  additionalMaterialUrl: z.string().nullable().optional(),
  keyLearningPoints: z.array(keyLearningPointsSchema).nullable().optional(),
  pupilLessonOutcome: z.string().nullable().optional(),
  lessonKeywords: z.array(keywordsSchema).nullable().optional(),
  copyrightContent: copyrightContentSchema,
  supervisionLevel: z.string().nullable(),
  worksheetUrl: z.string().nullable(),
  presentationUrl: z.string().nullable(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcriptSentences: z.union([z.array(z.string()), z.string()]).nullable(),
  isWorksheetLandscape: z.boolean().optional().nullable(),
  hasCopyrightMaterial: z.boolean().optional().nullable(),
  expired: z.boolean().nullable(),
  starterQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  videoTitle: z.string().nullish(),
  lessonCohort: z.string().nullish(),
  updatedAt: z.string(),
  lessonGuideUrl: z.string().nullable(),
  phonicsOutcome: z.string().nullish(),
  actions: camelActionSchema.nullish(),
  hasMediaClips: z.boolean(),
  additionalFiles: z.array(z.string()).nullable(),
  lessonMediaClips: mediaClipsRecordCamelSchema.nullish(),
  lessonOutline: z.array(z.object({ lessonOutline: z.string() })).nullable(),
});
export type LessonBase = z.infer<typeof baseLessonOverviewSchema>;

export const lessonDownloadsListSchema = z.array(
  z.object({
    exists: z.boolean().nullable(),
    type:
      z.enum([
        "presentation",
        "intro-quiz-questions",
        "intro-quiz-answers",
        "exit-quiz-questions",
        "exit-quiz-answers",
        "worksheet-pdf",
        "worksheet-pptx",
        "supplementary-pdf",
        "supplementary-docx",
        "curriculum-pdf",
        "lesson-guide-pdf",
        "additional-files",
      ]) || z.string().regex(/^additional-file-\d+$/),
    label: z.string(),
    ext: z.string(),
    forbidden: z.union([
      z.array(z.object({ copyright_info: z.string() })),
      z.boolean().optional().nullish(),
    ]),
    assetId: z.number().optional(),
    size: z.number().optional(),
  }),
);

export const lessonAdditionalFilesListSchema = z.array(
  z.object({
    exists: z.boolean().nullable(),
    type: z.enum(["additional-files"]),
    label: z.string(),
    ext: z.string(),
    forbidden: z.union([
      z.array(z.object({ copyright_info: z.string() })),
      z.boolean().optional().nullish(),
    ]),
    assetId: z.number(),
    size: z.number(),
  }),
);

export const baseLessonDownloadsSchema = z.object({
  isLegacy: z.boolean(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  downloads: lessonDownloadsListSchema,
  additionalFiles: lessonAdditionalFilesListSchema,
  expired: z.boolean().nullable(),
  isSpecialist: z.literal(false),
  copyrightContent: copyrightContentSchema,
  updatedAt: z.string(),
  geoRestricted: z.boolean().nullable(),
  loginRequired: z.boolean().nullable(),
  actions: camelActionSchema.nullable().optional(),
});

export const lessonListItemSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  description: z.string(),
  pupilLessonOutcome: z.string().nullish(),
  expired: z.boolean().nullable(),
  quizCount: z.number().nullish(),
  videoCount: z.number().nullish(),
  presentationCount: z.number().nullish(),
  worksheetCount: z.number().nullish(),
  hasCopyrightMaterial: z.boolean().nullish(),
  orderInUnit: z.number().nullish(),
  lessonCohort: z.string().nullish(),
  actions: camelActionSchema.nullish(),
});

export const lessonListSchema = z.array(lessonListItemSchema);

export type LessonListSchema = z.infer<typeof lessonListSchema>;

export const legacyAssetObjectSchema = z
  .object({
    google_drive: z.object({
      id: z.string(),
      url: z.string(),
    }),
    google_drive_downloadable_version: z
      .object({
        id: z.string(),
        url: z.string().nullish(),
      })
      .nullish(),
  })
  .nullish();

export const lessonShareResourceSchema = z.object({
  exists: z.boolean().nullable(),
  type: z.enum([
    "intro-quiz-questions",
    "exit-quiz-questions",
    "worksheet-pdf",
    "video",
  ]),
  label: z.string(),
  metadata: z.string().nullable(),
});
