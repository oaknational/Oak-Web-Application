import { z } from "zod";

// const textAnswerSchema = z.object({
//   text: z.string().optional(),
//   type: z.string().optional(),
// });

// const imageAnswerSchema = z.object({
//   image_object: z.object({}),
//   type: z.string(),
// });

// const multipleChoiceSchema = z.object({
//   answer: z.array(textAnswerSchema.optional(), imageAnswerSchema.optional()),
//   answer_is_active: z.boolean().optional(),
//   answer_is_correct: z.boolean().optional(),
// });

// const shortAnswerSchema = z.object({
//   answer: z.array(textAnswerSchema.optional(), imageAnswerSchema.optional()),
//   answer_is_active: z.boolean().optional(),
//   answer_is_default: z.boolean().optional(),
// });

// const orderSchema = z.object({
//   answer: z.array(textAnswerSchema.optional()),
//   correct_order: z.number().optional(),
//   answer_is_active: z.boolean().optional(),
// });

// const matchSchema = z.object({
//   answer_is_active: z.boolean().optional(),
//   correct_choice: z.array(textAnswerSchema),
//   match_options: z.array(textAnswerSchema),
// });

// const quizObjectSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   questions: z
//     .array(
//       z.object({
//         questionType: z.string(),
//         questionStem: z.array(textAnswerSchema, imageAnswerSchema).nullable(),
//         questionAnswer: z
//           .object({
//             "multiple-choice": z.array(multipleChoiceSchema.optional()),
//             "short-answer": z.array(shortAnswerSchema.optional()),
//             order: z.array(orderSchema.optional()).optional(),
//             match: z.array(matchSchema.optional()).optional(),
//           })
//           .optional(),
//         order: z.number(),
//       })
//     )
//     .nullable(),
// });

// const contentGuidanceDetailsSchema = z.object({
//   details: z.string(),
// });

// const lessonEquipmentAndResourcesSchema = z.object({
//   equipment: z.string(),
// });

// const keyLearningPointsSchema = z.object({
//   key_learning_point: z.string(),
// });

// const keywordsSchema = z.object({
//   keyword: z.string(),
//   description: z.string(),
// });

// const copyrightContentSchema = z.object({
//   copyright_info: z.string(),
// });

// const lessonOverviewSchema = z.object({
//   lessonSlug: z.string(),
//   lessonTitle: z.string(),
//   programmeSlug: z.string(),
//   unitSlug: z.string(),
//   unitTitle: z.string(),
//   keyStageSlug: z.string(),
//   keyStageTitle: z.string(),
//   subjectSlug: z.string(),
//   subjectTitle: z.string(),
//   contentGuidanceDetails: z.array(contentGuidanceDetailsSchema).nullable(),
//   lessonEquipmentAndResources: z
//     .array(lessonEquipmentAndResourcesSchema)
//     .nullable(),
//   keyLearningPoints: z.array(keyLearningPointsSchema).nullable(),
//   pupilLessonOutcome: z.string().nullable(),
//   lessonKeywords: z.array(keywordsSchema).nullable(),
//   copyrightContent: z.array(copyrightContentSchema).nullable(),
//   supervisionLevel: z.string().nullable(),
//   worksheetUrl: z.string().nullable(),
//   presentationUrl: z.string().nullable(),
//   videoMuxPlaybackId: z.string().nullable(),
//   videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
//   transcriptSentences: z.array(z.string()).nullable(),
// });

// OLD SCHEMA

const lessonOverviewQuizData = z.array(
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

const lessonQuizInfoData = z
  .object({
    title: z.string(),
    questionCount: z.number(),
  })
  .nullable();

const lessonOverviewSchema = z.object({
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  programmeSlug: z.string(),
  unitTitle: z.string(),
  unitSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  coreContent: z.array(z.string().nullable()),
  contentGuidance: z.string().nullable(),
  equipmentRequired: z.string().nullable(),
  presentationUrl: z.string().nullable(),
  supervisionLevel: z.string().nullable(),
  worksheetUrl: z.string().nullable(),
  isWorksheetLandscape: z.boolean(),
  hasCopyrightMaterial: z.boolean(),
  videoMuxPlaybackId: z.string().nullable(),
  videoWithSignLanguageMuxPlaybackId: z.string().nullable(),
  transcriptSentences: z.array(z.string()).nullable(),
  hasDownloadableResources: z.boolean().nullable(),
  introQuiz: lessonOverviewQuizData,
  exitQuiz: lessonOverviewQuizData,
  introQuizInfo: lessonQuizInfoData,
  exitQuizInfo: lessonQuizInfoData,
  expired: z.boolean(),
});

export type LessonOverviewPageData = z.infer<typeof lessonOverviewSchema>;

export default lessonOverviewSchema;
