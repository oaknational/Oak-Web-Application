import sdk from "../../sdk";

import additionalAssetsQuery from "./additionalAssets.query";

describe("additionalAssetsQuery", () => {
  it("returns empty array when no asset IDs provided", async () => {
    const result = await additionalAssetsQuery(sdk)({ assetIds: [] });
    expect(result).toEqual([]);
  });

  it("returns empty array when no assets found", async () => {
    const result = await additionalAssetsQuery({
      ...sdk,
      additionalAssets: jest.fn(() => Promise.resolve({ assets: [] })),
    })({ assetIds: [1, 2, 3] });

    expect(result).toEqual([]);
  });

  it("returns valid assets and filters invalid ones", async () => {
    const validAsset = {
      asset_id: 123,
      asset_type: "downloadable_file" as const,
      asset_uid: "asset-uid-123",
      asset_object: {
        pdf: { bucket_name: "test-bucket", bucket_path: "path/to/file.pdf" },
      },
      updated_at: "2024-01-01T00:00:00Z",
      title: "Test File",
    };

    const invalidAsset = {
      // Invalid: wrong asset_type (schema expects "downloadable_file" literal)
      asset_id: 456,
      asset_type: "other_type",
      asset_uid: "asset-uid-456",
      asset_object: {},
      updated_at: "2024-01-01T00:00:00Z",
      title: null,
    };

    const result = await additionalAssetsQuery({
      ...sdk,
      additionalAssets: jest.fn(() =>
        Promise.resolve({
          assets: [validAsset, invalidAsset],
        }),
      ),
    })({ assetIds: [123, 456] });

    // Should only return the valid asset
    expect(result.length).toBe(1);
    expect(result[0]?.asset_id).toBe(123);
  });

  it("preserves title field when present", async () => {
    const assetWithTitle = {
      asset_id: 123,
      asset_type: "downloadable_file" as const,
      asset_uid: "asset-uid-123",
      asset_object: {
        mp3: { bucket_name: "test-bucket", bucket_path: "path/to/audio.mp3" },
      },
      updated_at: "2024-01-01T00:00:00Z",
      title: "Audio File Title",
    };

    const result = await additionalAssetsQuery({
      ...sdk,
      additionalAssets: jest.fn(() =>
        Promise.resolve({
          assets: [assetWithTitle],
        }),
      ),
    })({ assetIds: [123] });

    expect(result[0]?.title).toBe("Audio File Title");
  });

  it("handles assets without title", async () => {
    const assetWithoutTitle = {
      asset_id: 123,
      asset_type: "downloadable_file" as const,
      asset_uid: "asset-uid-123",
      asset_object: {
        pdf: { bucket_name: "test-bucket", bucket_path: "path/to/file.pdf" },
      },
      updated_at: "2024-01-01T00:00:00Z",
      title: null,
    };

    const result = await additionalAssetsQuery({
      ...sdk,
      additionalAssets: jest.fn(() =>
        Promise.resolve({
          assets: [assetWithoutTitle],
        }),
      ),
    })({ assetIds: [123] });

    expect(result[0]?.title).toBeNull();
  });
});
