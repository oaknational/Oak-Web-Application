import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";

const curriculumResourceAdditionalAssetFixture = (
  partial?: Partial<AdditionalAsset>,
): AdditionalAsset => {
  return {
    asset_id: 123,
    asset_type: "downloadable_file",
    asset_uid: "asset_uid",
    asset_object: {
      mp3: {
        bucket_name: "bucket--ingested-assets",
        bucket_path: "sample-additional-file.pdf",
      },
    },
    updated_at: "2023-01-01T00:00:00.000Z",
    title: "Sample Additional File",
    ...partial,
  };
};

export default curriculumResourceAdditionalAssetFixture;
