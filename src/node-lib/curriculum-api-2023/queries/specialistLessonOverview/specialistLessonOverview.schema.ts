import { z } from "zod";

import { LessonOverviewPageData } from "../lessonOverview/lessonOverview.schema";
import {
  baseLessonOverviewSchema,
  lessonOverviewQuizData,
} from "../../shared.schema";

export type SpecialistLessonOverviewData = Omit<
  LessonOverviewPageData,
  | "keyStageSlug"
  | "keyStageTitle"
  | "tierTitle"
  | "tierSlug"
  | "yearTitle"
  | "examBoardTitle"
> & {
  developmentStageTitle: string;
  developmentStageSlug: string;
  phaseTitle: string;
  phaseSlug: string;
  isCanonical?: boolean;
  threads?: Threads[] | null;
};

const content_guidance_schema = z.object({
  content_guidance_label: z.string(),
  content_guidance_description: z.string(),
  content_guidance_area: z.string(),
});

const misconceptions_and_commom_mistakes_schema = z.object({
  misconception: z.string(),
  response: z.string(),
});

const teacher_tips_schema = z.object({
  teacher_tip: z.string(),
});

const lesson_equipment_and_resources_schema = z.object({
  equipment: z.string(),
});

const key_learning_points_schema = z.object({
  key_learning_point: z.string().nullable(),
});

const threads = z.object({
  threadSlug: z.string(),
  threadTitle: z.string(),
});

type Threads = z.infer<typeof threads>;

const combined_programme_fields = z.object({
  subject: z.string(),
  subject_slug: z.string(),
  developmentstage: z.string(),
  developmentstage_slug: z.string(),
  phase_description: z.string(),
  phase_slug: z.string(),
});

export const copyright_content_schema = z.object({
  copyrightInfo: z.string(),
});

export const specialistLessonOverviewRawSchema = z.array(
  z.object({
    lesson_slug: z.string(),
    lesson_title: z.string(),
    synthetic_programme_slug: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    combined_programme_fields: combined_programme_fields,
    pupil_lesson_outcome: z.string(),
    key_learning_points: z.array(key_learning_points_schema).nullable(),
    contains_copyright_content: z.boolean(),
    expired: z.boolean().nullable(),
    misconceptions_and_common_mistakes: z
      .array(misconceptions_and_commom_mistakes_schema)
      .nullable(),
    equipment_and_resources: z
      .array(lesson_equipment_and_resources_schema)
      .nullable()
      .optional(),
    teacher_tips: z.array(teacher_tips_schema).nullable(),
    content_guidance: z.array(content_guidance_schema).nullable(),
    supervision_level: z.string(),
    threads: z.array(threads).nullable(),
    video_mux_playback_id: z.string().nullable(),
    video_with_sign_language_mux_playback_id: z.string().nullable(),
    video_title: z.string().nullable(),
    worksheet_url: z.string().nullable(),
    presentation_url: z.string().nullable(),
    starter_quiz: lessonOverviewQuizData,
    exit_quiz: lessonOverviewQuizData,
    transcript_sentences: z.union([z.array(z.string()), z.string()]).nullable(),
  }),
);

export type SpecialistLessonDataRaw = z.infer<
  typeof specialistLessonOverviewRawSchema
>;

const specialistLessonOverviewSchema = baseLessonOverviewSchema.extend({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  phaseSlug: z.string(),
  phaseTitle: z.string(),
  developmentStageSlug: z.string(),
  developmentStageTitle: z.string(),
});

export type SpecialistLessonOverview = z.infer<
  typeof specialistLessonOverviewSchema
>;

export default specialistLessonOverviewSchema;
