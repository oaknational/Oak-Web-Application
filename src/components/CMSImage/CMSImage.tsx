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
  const altTextString =
    typeof rest.alt === "string" ? rest.alt : image.altText || undefined;

  /**
   * alt="" as per:
   * https://www.w3.org/WAI/tutorials/images/decorative/
   * > In these cases, a null (empty) alt text should be provided (alt="")
   * > so that they can be ignored by assistive technologies, such as screen readers.
   */
  const finalAltText = image.isPresentational ? "" : altTextString;

  return (
    <Box $background="pastelTurqoise" $width="100%">
      <Img {...imageProps} layout="intrinsic" {...rest} alt={finalAltText} />
    </Box>
  );
};

export default CMSImage;
