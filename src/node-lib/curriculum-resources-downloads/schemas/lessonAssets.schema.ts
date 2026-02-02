import { z } from "zod";

//TODO: Possibly move to the curriculum schemas repo?

const FileLocationSchema = z.object({
  bucket_name: z.string().nullish(),
  bucket_path: z.string().nullish(),
});

const QuizObjectSchema = z.object({
  quiz: z.object({
    pdf: FileLocationSchema.nullish(),
  }),
  quiz_answers: z.object({
    pdf: FileLocationSchema.nullish(),
  }),
});

const PresentationAssetObjectSchema = z.object({
  pdf: FileLocationSchema.nullish(),
  powerpoint: FileLocationSchema.nullish(),
  opendocument_presentation: FileLocationSchema.nullish(),
});

const TextAssetObjectSchema = z.object({
  pdf: FileLocationSchema.nullish(),
  word: FileLocationSchema.nullish(),
  opendocument_text: FileLocationSchema.nullish(),
});

const LessonGuideAssetObjectSchema = z.object({
  pdf: FileLocationSchema.nullish(),
  word: FileLocationSchema.nullish(),
});

const AssetSlidedeckSchema = z.object({
  asset_type: z.literal("slidedeck"),
  asset_uid: z.string(),
  asset_object: PresentationAssetObjectSchema.nullish(),
  updated_at: z.string(),
});

const AssetWorksheetSchema = z.object({
  asset_type: z.literal("worksheet"),
  asset_uid: z.string(),
  asset_object: PresentationAssetObjectSchema.nullish(),
  updated_at: z.string(),
});

const AssetWorksheetAnswersSchema = z.object({
  asset_type: z.literal("worksheet_answers"),
  asset_uid: z.string(),
  asset_object: PresentationAssetObjectSchema.nullish(),
  updated_at: z.string(),
});

const AssetSupplementaryWorksheetSchema = z.object({
  asset_type: z.literal("supplementary_resource"),
  asset_uid: z.string(),
  asset_object: TextAssetObjectSchema.nullish(),
  updated_at: z.string(),
});

const QuizSchema = z.object({
  quiz_uid: z.string(),
  quiz_object: QuizObjectSchema.nullish(),
  updated_at: z.string(),
});

const AssetLessonGuideSchema = z.object({
  asset_type: z.literal("lesson_guide"),
  asset_uid: z.string(),
  updated_at: z.string(),
  url: z.string(),
  asset_object: LessonGuideAssetObjectSchema.nullish(),
});

const DownloadableFilesSchema = z.object({
  asset_id: z.number(),
  media_object: z.object({
    display_name: z.string(),
  }),
});

const FeaturesSchema = z.object({
  agf__geo_restricted: z.boolean().optional(),
  agf__login_required: z.boolean().optional(),
});

export const LessonAssetsSchema = z.object({
  asset_slidedeck: AssetSlidedeckSchema.nullish(),
  asset_worksheet: AssetWorksheetSchema.nullish(),
  asset_worksheet_answers: AssetWorksheetAnswersSchema.nullish(),
  asset_supplementary_asset: AssetSupplementaryWorksheetSchema.nullish(),
  quiz_starter: QuizSchema.nullish(),
  quiz_exit: QuizSchema.nullish(),
  asset_lesson_guide: AssetLessonGuideSchema.nullish(),
  tpc_downloadablefiles: z.array(DownloadableFilesSchema).nullish(),
  features: FeaturesSchema.nullish(),
  slug: z.string(),
});

export type LessonAssets = z.infer<typeof LessonAssetsSchema>;

export const AdditionalAssetSchema = z.object({
  asset_id: z.number(),
  asset_type: z.literal("downloadable_file"),
  asset_uid: z.string(),
  asset_object: z.record(z.string(), FileLocationSchema),
  updated_at: z.string(),
  title: z.string().nullish(),
});

export type AdditionalAsset = z.infer<typeof AdditionalAssetSchema>;
