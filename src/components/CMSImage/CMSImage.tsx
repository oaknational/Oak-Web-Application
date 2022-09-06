import { FC } from "react";
import Img, { ImageProps } from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { SanityClientLike } from "@sanity/image-url/lib/types/types";

import config from "../../config";
import Box from "../Box";
import { SanityImage } from "../../node-lib/cms";

type CMSImageProps = Omit<ImageProps, "src"> & {
  image: SanityImage;
};

/**
 * Provide a "client like" object instead of using the
 * actual sanity client to cut down on dependency size
 */
export const sanityClientLike: SanityClientLike = {
  clientConfig: {
    projectId: config.get("sanityProjectId"),
    dataset: config.get("sanityDataset"),
    apiHost: `https://${config.get("sanityAssetCDNHost")}`,
  },
};

const CMSImage: FC<CMSImageProps> = ({ image, ...rest }) => {
  const imageProps = useNextSanityImage(sanityClientLike, image, {
    enableBlurUp: false,
  });

  // If alt is explicitly provided, use it even if it's empty
  // otherwise attempt the one from the CMS, or fall back to none
  const altText =
    typeof rest.alt === "string" ? rest.alt : image.altText || undefined;

  return (
    <Box $background="pastelTurqoise" $width="100%">
      <Img {...imageProps} layout="intrinsic" {...rest} alt={altText} />
    </Box>
  );
};

export default CMSImage;
