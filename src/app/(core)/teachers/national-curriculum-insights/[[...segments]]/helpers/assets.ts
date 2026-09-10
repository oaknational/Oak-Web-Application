import {
  buildFileUrl,
  buildImageUrl,
  parseFileAssetId,
  parseImageAssetId,
} from "@sanity/asset-utils";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

// Fixed hierarchy artwork is shared by every subject. Editorial images belong
// to their CMS modules; these IDs are only the shared illustrations and fallbacks.
export const insightsAssetIds = {
  hero: "file-c060a0984b0ce355823a8315b1ad9ee9197cd090-jpg",
  newsletter: "image-49f4edb4117e4d25c763cc5b3598828e3baa9ee5-60x50-png",
  overview: "image-7bdedbb1d68dc0b318f75e725b81841805ae0d11-332x259-png",
  primary: "image-b5982cb9fcb327d5d662f610958dbfc1aec92575-97x97-svg",
  secondary: "image-ebc53bd319b7f63fdeb80637b14c9b03fefec7d4-59x93-svg",
  keyStage1: "image-92dd15c9f0f59f06a1787b3a8ff1d07a16af5e12-262x172-png",
  keyStage2: "image-9a7ba008f3126caeada318bc7377862dab22c3f8-250x272-png",
  keyStage3: "image-a0a7adbb2cd0f70ac104da56c9a8981cd2a5d275-272x288-png",
  keyStage4: "image-f54b34eac9b7caafc37eadf824eaf11522573326-277x231-png",
} as const;

export const insightsAssetUrl = (asset: keyof typeof insightsAssetIds) => {
  const id = insightsAssetIds[asset];
  const project = {
    projectId: getBrowserConfig("sanityProjectId"),
    dataset: getBrowserConfig("sanityDataset"),
  };
  const url = id.startsWith("file-")
    ? buildFileUrl({ ...parseFileAssetId(id), ...project })
    : buildImageUrl({ ...parseImageAssetId(id), ...project });
  return getProxiedSanityAssetUrl(url);
};
