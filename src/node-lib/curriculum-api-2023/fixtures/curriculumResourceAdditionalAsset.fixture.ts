import type { AdditionalAsset } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/additionalAssets.schema";

const curriculumResourceAdditionalAssetFixture = (
  partial?: Partial<AdditionalAsset>,
): AdditionalAsset => {
  return {
    asset_id: 123,
    asset_type: "downloadable_file",
    asset_uid: "additional-123",
    updated_at: "2024-01-01T00:00:00.000Z",
    asset_object: {
      mp3: {
        bucket_name: "bucket--ingested-assets",
        bucket_path: "additional/file.mp3",
      },
    },
    title: "test-audio",
    ...partial,
  };
};

export default curriculumResourceAdditionalAssetFixture;
