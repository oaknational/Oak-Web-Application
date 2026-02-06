import { z } from "zod";

import { FileLocationSchema } from "./lessonAssets.schema";

export const AdditionalAssetSchema = z.object({
  asset_id: z.number(),
  asset_type: z.literal("downloadable_file"),
  asset_uid: z.string(),
  asset_object: z.record(z.string(), FileLocationSchema),
  updated_at: z.string(),
  title: z.string().nullish(),
});

export type AdditionalAsset = z.infer<typeof AdditionalAssetSchema>;
