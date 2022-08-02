import { SanityImage } from "../../node-lib/cms";

export const mockImageAsset = (id = "abcdef"): SanityImage => {
  return {
    asset: {
      _id: `image-${id}-300x300-png`,
      url: `https://cdn.sanity.io/images/p/d/${id}-300x300.png`,
    },
  };
};
