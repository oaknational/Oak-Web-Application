/**
 *
 * Ultimately some of these types will be used more widely at which point they could be moved to a shared location
 *
 */

import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsSchema,
  multipleChoiceSchemaCamel,
  shortAnswerSchemaCamel,
  orderSchemaCamel,
  matchSchemaCamel,
  imageItemSchemaCamel,
  textItemSchemaCamel,
  additionalFileObjectSchemaCamel,
  additionalFilesSchemaCamel,
  QuestionCamel,
  LessonContentCamel,
  SyntheticUnitvariantLessonsCamel,
} from "@oaknational/oak-curriculum-schema";

export type QuizQuestion = QuestionCamel;

export type QuizQuestionAnswers = NonNullable<
  Pick<QuestionCamel, "answers">["answers"]
>;

export type MCAnswer = z.infer<typeof multipleChoiceSchemaCamel>;

export type ShortAnswer = z.infer<typeof shortAnswerSchemaCamel>;

export type OrderAnswer = z.infer<typeof orderSchemaCamel>;
export type MatchAnswer = z.infer<typeof matchSchemaCamel>;

export type ImageItem = z.infer<typeof imageItemSchemaCamel>;
export type TextItem = z.infer<typeof textItemSchemaCamel>;
export type ImageOrTextItem = ImageItem | TextItem;

export const lessonContentSchema = lessonContentSchemaFull.omit({
  _state: true,
  video_duration: true,
  has_worksheet_google_drive_downloadable_version: true,
  slide_deck_asset_id: true,
  has_slide_deck_asset_object: true,
  worksheet_asset_id: true,
  worksheet_answers_asset_id: true,
  has_worksheet_answers_asset_object: true,
  supplementary_asset_id: true,
  has_supplementary_asset_object: true,
  supplementary_asset_object_url: true,
  worksheet_asset_object_url: true,
  slide_deck_asset_object_url: true,
  geo_restricted: true,
  login_required: true,
});

export type LessonContent = Omit<
  LessonContentCamel,
  "starterQuiz" | "exitQuiz" | "transcriptSentences"
> & {
  starterQuiz: QuizQuestion[];
  exitQuiz: QuizQuestion[];
  transcriptSentences: string | string[];
};

export type AdditionalFile = z.infer<typeof additionalFileObjectSchemaCamel>;

export type AdditionalFiles = z.infer<typeof additionalFilesSchemaCamel>;

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = Omit<
  SyntheticUnitvariantLessonsCamel,
  "nullUnitvariantId"
>;
