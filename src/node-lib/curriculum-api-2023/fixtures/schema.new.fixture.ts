import { z } from "zod";

import {
  lessonDataSchema,
  unitvariantSchema,
  unitDataSchema,
  programmeFieldsSchema,
  syntheticUnitvariantLessonsSchema,
  lessonContentSchema,
} from "../shared.schema.new";

type LessonDataSnake = z.infer<typeof lessonDataSchema>;

export const lessonDataFixture = (): LessonDataSnake => ({
  lesson_id: 1,
  lesson_uid: "lesson-uid",
  title: "lesson-title",
  description: "lesson-description",
  slug: "lesson-slug",
  pupil_lesson_outcome: "pupil-lesson-outcome",
  key_learning_points: [{}],
  equipment_and_resources: null,
  content_guidance_details: null,
  content_guidance: null,
  supervision_level: null,
  thirdpartycontent_list: null,
  misconceptions_and_common_mistakes: null,
  keywords: null,
  video_id: null,
  sign_language_video_id: null,
  quiz_id_starter: null,
  quiz_id_exit: null,
  asset_id_slidedeck: null,
  asset_id_worksheet: null,
  copyright_content: null,
  _state: "published",
  _cohort: "2023-2024",
  deprecated_fields: null,
});

type UnitvariantSnake = z.infer<typeof unitvariantSchema>;

export const unitvariantFixture = (): UnitvariantSnake => ({
  unitvariant_id: 1,
  unit_id: 1,
  _deleted: false,
  _state: "published",
  _cohort: "2023-2024",
  unit_overrides: {},
  programme_fields: {},
});

type UnitDataSnake = z.infer<typeof unitDataSchema>;

export const unitDataFixture = (): UnitDataSnake => ({
  unit_id: 0,
  unit_uid: "unit-uid",
  description: null,
  slug: "unit-slug",
  tags: null,
  title: "unit-title",
  _state: "published",
  _cohort: "2023-2024",
});

type ProgrammeFieldsSnake = z.infer<typeof programmeFieldsSchema>;

export const programmeFieldsFixture = (): ProgrammeFieldsSnake => ({
  tier: null,
  tier_id: null,
  tier_slug: null,
  tier_description: null,
  tier_display_order: null,
  examboard: null,
  examboard_id: null,
  examboard_slug: null,
  examboard_description: null,
  examboard_display_order: null,
  year: "year",
  year_slug: "year-1",
  year_id: 1,
  year_description: "year-description",
  year_display_order: 1,
  keystage: "KS1",
  keystage_id: 1,
  keystage_slug: "ks1",
  keystage_description: "Key Stage 1",
  keystage_display_order: 1,
  phase: "primary",
  phase_id: 0,
  phase_slug: "primary",
  phase_description: "primary",
  phase_display_order: 1,
  subject: "subject",
  subject_id: 1,
  subject_slug: "subject-slug",
  subject_description: "subject-description",
  subject_display_order: 1,
});

type SUVLessons = z.infer<typeof syntheticUnitvariantLessonsSchema>;

export const syntheticUnitvariantLessonsSchemaFixture = (
  overrides: Partial<SUVLessons> = {},
): SUVLessons => ({
  lesson_slug: "lesson-slug",
  unit_slug: "unit-slug",
  programme_slug: "programme-slug",
  is_legacy: false,
  lesson_data: lessonDataFixture(),
  unit_data: unitDataFixture(),
  null_unitvariant: unitvariantFixture(),
  programme_fields: programmeFieldsFixture(),
  supplementary_data: {
    unit_order: 1,
    order_in_unit: 1,
  },
  ...overrides,
});

type LessonContentSnake = z.infer<typeof lessonContentSchema>;

export const contentFixture = (): LessonContentSnake => ({
  lesson_id: 1,
  lesson_title: "lesson-title",
  lesson_slug: "lesson-slug",
  deprecated_fields: {},
  is_legacy: false,
  misconceptions_and_common_mistakes: null,
  equipment_and_resources: null,
  teacher_tips: null,
  key_learning_points: null,
  pupil_lesson_outcome: "pupil-lesson-outcome",
  lesson_keywords: null,
  content_guidance: null,
  video_mux_playback_id: null,
  video_id: null,
  video_with_sign_language_mux_playback_id: null,
  video_title: null,
  transcript_sentences: null,
  starter_quiz: null,
  starter_quiz_id: null,
  exit_quiz: null,
  exit_quiz_id: null,
  supervision_level: null,
  state: "published",
});
