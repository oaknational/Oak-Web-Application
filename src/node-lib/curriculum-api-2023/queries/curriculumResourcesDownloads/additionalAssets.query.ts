import { Sdk } from "../../sdk";

import {
  AdditionalAssetSchema,
  type AdditionalAsset,
} from "./additionalAssets.schema";

const additionalAssetsQuery =
  (sdk: Sdk) =>
  async (args: { assetIds: number[] }): Promise<AdditionalAsset[]> => {
    const { assetIds } = args;

    // Early return for empty input
    if (assetIds.length === 0) {
      return [];
    }

    const res = await sdk.additionalAssets({ assetIds });
    const assets = res.assets;

    if (!assets || assets.length === 0) {
      return [];
    }

    // Validate each asset individually, filter invalid ones
    const validAssets: AdditionalAsset[] = [];

    for (const asset of assets) {
      const result = AdditionalAssetSchema.safeParse(asset);
      if (result.success) {
        validAssets.push(result.data);
      } else {
        // Warn but don't fail for individual invalid assets
        console.warn(
          "Failed to parse additional asset:",
          JSON.stringify(result.error.errors, null, 2),
        );
      }
    }

    return validAssets;
  };

export default additionalAssetsQuery;
