import sanityImage from "@sanity/image-url";
import {
  SanityModernClientLike,
  SanityImageSource,
} from "@sanity/image-url/lib/types/types";

import getBrowserConfig from "../../browser-lib/getBrowserConfig";

/**
 * Provide a "client like" object instead of using the
 * actual sanity client to cut down on dependency size
 */
export const sanityClientLike: SanityModernClientLike = {
  config: () => {
    return {
      projectId: getBrowserConfig("sanityProjectId"),
      dataset: getBrowserConfig("sanityDataset"),
      apiHost: `https://${getBrowserConfig("sanityAssetCDNHost")}`,
    };
  },
};
export const imageBuilder = sanityImage(sanityClientLike);

export function getSanityRefId(imageSource: SanityImageSource): string {
  if (typeof imageSource === "string") {
    return imageSource;
  }

  if (typeof imageSource === "string") {
    return imageSource;
  }

  if ("asset" in imageSource) {
    return imageSource.asset._ref || imageSource.asset._id;
  }

  if ("_ref" in imageSource) {
    return imageSource._ref;
  }

  return imageSource._id || "";
}

export function getImageDimensions(
  id: string | undefined,
  { fill }: { fill?: boolean },
) {
  if (fill) {
    return { width: undefined, height: undefined, aspectRatio: undefined };
  }
  const defaultDimensions = { width: 0, height: 0, aspectRatio: undefined };

  if (!id) {
    return defaultDimensions;
  }

  const dimensions = id.split("-")[2];

  if (!dimensions) {
    return defaultDimensions;
  }

  const [width, height] = dimensions
    .split("x")
    .map((num: string) => parseInt(num, 10));

  if (!width || !height) {
    return defaultDimensions;
  }

  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}
