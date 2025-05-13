import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export const getCloudinaryImageUrl = (path: string) => {
  const hostname = getBrowserConfig("oakComponentsAssetsHost");
  const assetPath = getBrowserConfig("oakComponentsAssetsPath");
  return `https://${hostname}/${assetPath}/${path}`;
};
