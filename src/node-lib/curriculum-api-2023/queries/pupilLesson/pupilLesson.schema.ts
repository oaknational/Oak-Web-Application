import { z } from "zod";

const _stateSchema = z.enum(["published", "new", "migration"]);

export type _State = z.infer<typeof _stateSchema>;

const _cohortSchema = z.enum(["2020-2023", "2023-2024", "0"]);

export type _Cohort = z.infer<typeof _cohortSchema>;

const lessonDataSchema = z.object({
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
  _state: _stateSchema,
  _cohort: _cohortSchema,
});

export type LessonData = z.infer<typeof lessonDataSchema>;

const programmeFieldsSchema = z.object({
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

export type ProgrammeFields = z.infer<typeof programmeFieldsSchema>;

const unitDataSchema = z.object({
  unit_id: z.number(),
  unit_uid: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  tags: z.array(z.number()).nullable(),
  deprecated_fields: z.object({}).nullable().optional(),
  title: z.string(),
  _state: _stateSchema,
  _cohort: _cohortSchema,
});

export type UnitData = z.infer<typeof unitDataSchema>;

const unitvariantSchema = z.object({
  _state: _stateSchema,
  _cohort: _cohortSchema,
  unit_id: z.number(),
  unitvariant_id: z.number(),
  _deleted: z.boolean(),
  unit_overrides: unitDataSchema.partial(),
  programme_fields: programmeFieldsSchema.partial(),
});

export type Unitvariant = z.infer<typeof unitvariantSchema>;

// This really should have a more generic name. Holding off on renaming it pending an RFC on where to store shared schemas.

export const pupilLessonSchema = z.object({
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

export type PupilLesson = z.infer<typeof pupilLessonSchema>;
