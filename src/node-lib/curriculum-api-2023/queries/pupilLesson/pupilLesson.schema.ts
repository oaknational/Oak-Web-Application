/**
 *
 * Ultimately some of these types will be used more widely at which point they could be moved to a shared location
 *
 */

import { z } from "zod";
import {
  lessonContentSchema as lessonContentSchemaFull,
  syntheticUnitvariantLessonsSchema,
  quizQuestionSchema,
  multipleChoiceSchema,
  shortAnswerSchema,
  orderSchema,
  matchSchema,
  imageItemSchema,
  textItemSchema,
  additionalFilesSchema,
  additionalFileObjectSchema,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export type QuizQuestion = ConvertKeysToCamelCase<
  z.infer<typeof quizQuestionSchema>
>;

export type QuizQuestionAnswers = NonNullable<
  ConvertKeysToCamelCase<z.infer<typeof quizQuestionSchema>["answers"]>
>;

export type MCAnswer = ConvertKeysToCamelCase<
  z.infer<typeof multipleChoiceSchema>
>;
export type ShortAnswer = ConvertKeysToCamelCase<
  z.infer<typeof shortAnswerSchema>
>;
export type OrderAnswer = ConvertKeysToCamelCase<z.infer<typeof orderSchema>>;
export type MatchAnswer = ConvertKeysToCamelCase<z.infer<typeof matchSchema>>;

export type ImageItem = ConvertKeysToCamelCase<z.infer<typeof imageItemSchema>>;
export type TextItem = ConvertKeysToCamelCase<z.infer<typeof textItemSchema>>;
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
  ConvertKeysToCamelCase<z.infer<typeof lessonContentSchema>>,
  "starterQuiz" | "exitQuiz" | "transcriptSentences"
> & {
  starterQuiz: QuizQuestion[];
  exitQuiz: QuizQuestion[];
  transcriptSentences: string | string[];
};

export type AdditionalFiles = ConvertKeysToCamelCase<
  z.infer<typeof additionalFilesSchema>
>;
export type AdditionalFile = ConvertKeysToCamelCase<
  z.infer<typeof additionalFileObjectSchema>
>;

export const lessonBrowseDataSchema = syntheticUnitvariantLessonsSchema.omit({
  null_unitvariant_id: true,
});

export type LessonBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;
