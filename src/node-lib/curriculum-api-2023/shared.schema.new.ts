import { z } from "zod";

/**
 *
 * - This should directly map to its equivalent in OWA
 * - The intention is for this file to be moved to an npm package that can be shared between DBT and OWA
 *
 */

export const _stateSchema = z.enum(["published", "new", "migration"]);
export const _cohortSchema = z.enum(["2020-2023", "2023-2024", "0"]);

export const lessonDataSchema = z.object({
  lesson_id: z.number(),
  lesson_uid: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  pupil_lesson_outcome: z.string(),
  key_learning_points: z.array(z.object({})),
  equipment_and_resources: z.array(z.object({})).nullable(),
  content_guidance_details: z.array(z.object({})).nullable(),
  content_guidance: z.array(z.number()).nullable(),
  copyright_content: z.array(z.object({})).nullable(),
  supervision_level: z.string().nullable(),
  thirdpartycontent_list: z.array(z.number()).nullable(),
  misconceptions_and_common_mistakes: z.array(z.object({})).nullable(),
  keywords: z.array(z.object({})).nullable(),
  video_id: z.number().nullable(),
  sign_language_video_id: z.number().nullable(),
  quiz_id_starter: z.number().nullable(),
  quiz_id_exit: z.number().nullable(),
  asset_id_slidedeck: z.number().nullable(),
  asset_id_worksheet: z.number().nullable(),
  deprecated_fields: z.record(z.unknown()).nullable(),
  _state: _stateSchema,
  _cohort: _cohortSchema,
});

export const programmeFieldsSchema = z.object({
  tier: z.string().nullable(),
  tier_id: z.number().nullable(),
  tier_slug: z.string().nullable(),
  tier_description: z.string().nullable(),
  tier_display_order: z.number().nullable(),

  examboard: z.string().nullable(),
  examboard_id: z.number().nullable(),
  examboard_slug: z.string().nullable(),
  examboard_description: z.string().nullable(),
  examboard_display_order: z.number().nullable(),

  year: z.string(),
  year_slug: z.string(),
  year_id: z.number(),
  year_description: z.string(),
  year_display_order: z.number(),

  keystage: z.string(),
  keystage_id: z.number(),
  keystage_slug: z.string(),
  keystage_description: z.string(),
  keystage_display_order: z.number(),

  phase: z.string(),
  phase_id: z.number(),
  phase_slug: z.string(),
  phase_description: z.string(),
  phase_display_order: z.number(),

  subject: z.string(),
  subject_id: z.number(),
  subject_slug: z.string(),
  subject_description: z.string(),
  subject_display_order: z.number(),

  legacy: z.string().optional(),
  dataset: z.string().optional(),
});

export const unitDataSchema = z.object({
  unit_id: z.number(),
  unit_uid: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  tags: z.array(z.number()).nullable(),
  title: z.string(),
  _state: _stateSchema,
  _cohort: _cohortSchema,
});

export const unitvariantSchema = z.object({
  _state: _stateSchema,
  _cohort: _cohortSchema,
  unit_id: z.number(),
  unitvariant_id: z.number(),
  _deleted: z.boolean(),
  unit_overrides: unitDataSchema.partial(),
  programme_fields: programmeFieldsSchema.partial(),
});

export const textItemSchema = z.object({
  text: z.string(),
  type: z.literal("text"),
});

export const imageObjectSchema = z.object({
  format: z.enum(["png", "jpg", "jpeg", "webp", "gif", "svg"]).optional(),
  secure_url: z.string().url(),
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
  public_id: z.string().optional(),
  version: z.number().optional(),
});

export const imageItemSchema = z.object({
  image_object: imageObjectSchema,
  type: z.literal("image"),
});

export const multipleChoiceSchema = z.object({
  answer: z.array(z.union([textItemSchema, imageItemSchema]).optional()),
  answer_is_active: z.boolean().optional(),
  answer_is_correct: z.boolean().optional(),
});

export const shortAnswerSchema = z.object({
  answer: z.array(z.union([textItemSchema, imageItemSchema]).optional()),
  answer_is_active: z.boolean().optional(),
  answer_is_default: z.boolean().optional(),
});

export const orderSchema = z.object({
  answer: z.array(textItemSchema),
  correct_order: z.number().optional(),
  answer_is_active: z.boolean().optional(),
});

export const matchSchema = z.object({
  answer_is_active: z.boolean().optional(),
  correct_choice: z.array(textItemSchema),
  match_options: z.array(textItemSchema).optional(),
});

export const quizQuestionSchema = z.object({
  question_id: z.number(),
  question_uid: z.string(),
  question_type: z.string(),
  question_stem: z
    .array(z.union([textItemSchema, imageItemSchema]))
    .optional()
    .nullable(),
  answers: z
    .object({
      "multiple-choice": z.array(multipleChoiceSchema).optional(),
      "short-answer": z.array(shortAnswerSchema).optional(),
      order: z.array(orderSchema).optional(),
      match: z.array(matchSchema).optional(),
    })
    .optional()
    .nullable(),
  feedback: z.string().optional().nullable(),
  hint: z.string().optional().nullable(),
  active: z.boolean().optional(),
  order: z.number(),
});

export const lessonEquipmentAndResourcesSchema = z.object({
  equipment: z.string(),
});

export const keyLearningPointsSchema = z.object({
  key_learning_point: z.string(),
});

export const keywordsSchema = z.object({
  keyword: z.string(),
  description: z.string(),
});

export const misconceptionsAndCommonMistakesSchema = z.object({
  misconception: z.string(),
  response: z.string(),
});

export const teacherTipsSchema = z.object({
  teacher_tip: z.string(),
});

export const contentGuidanceSchema = z.object({
  contentguidance_label: z.string().nullable(),
  contentguidance_description: z.string().nullable(),
  contentguidance_area: z.string().nullable(),
});

export const lessonContentSchema = z.object({
  lesson_id: z.number(),
  lesson_slug: z.string(),
  lesson_title: z.string().nullable(),
  content_guidance: z.array(contentGuidanceSchema).nullable(),
  misconceptions_and_common_mistakes: z
    .array(misconceptionsAndCommonMistakesSchema)
    .nullable(),
  teacher_tips: z.array(teacherTipsSchema).nullable(),
  equipment_and_resources: z
    .array(lessonEquipmentAndResourcesSchema)
    .nullable(),
  pupil_lesson_outcome: z.string().nullable(),
  lesson_keywords: z.array(keywordsSchema).nullable(),
  supervision_level: z.string().nullable(),
  key_learning_points: z.array(keyLearningPointsSchema).nullable().optional(),
  video_mux_playback_id: z.string().nullable(),
  video_with_sign_language_mux_playback_id: z.string().nullable(),
  video_id: z.number().nullable(),
  video_title: z.string().nullable(),
  transcript_sentences: z.string().nullable(),
  starter_quiz: z.array(quizQuestionSchema).optional().nullable(),
  exit_quiz: z.array(quizQuestionSchema).optional().nullable(),
  starter_quiz_id: z.number().nullable(),
  exit_quiz_id: z.number().nullable(),
  state: z.string(),
  is_legacy: z.boolean().nullable(),
  deprecated_fields: z.record(z.unknown()).nullable(),
});

export const syntheticUnitvariantLessonsSchema = z.object({
  lesson_slug: z.string(),
  unit_slug: z.string(),
  programme_slug: z.string(),
  is_legacy: z.boolean(),
  lesson_data: lessonDataSchema,
  unit_data: unitDataSchema,
  null_unitvariant: unitvariantSchema,
  programme_fields: programmeFieldsSchema,
  supplementary_data: z.object({
    unit_order: z.number(),
    order_in_unit: z.number(),
  }),
});
