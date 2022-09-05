import { FC } from "react";
import Img, { ImageProps } from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import {
  SanityClientLike,
  SanityImageSource,
} from "@sanity/image-url/lib/types/types";

import config from "../../config";
import Box from "../Box";

type CMSImageProps = Omit<ImageProps, "src"> & {
  image: SanityImageSource;
};

/**
 * Provide a "client like" object instead of using the
 * actual sanity client to cut down on dependency size
 */
const clientLike: SanityClientLike = {
  clientConfig: {
    projectId: config.get("sanityProjectId"),
    dataset: config.get("sanityDataset"),
    apiHost: `https://${config.get("sanityAssetCDNHost")}`,
  },
};

const CMSImage: FC<CMSImageProps> = ({ image, ...rest }) => {
  const imageProps = useNextSanityImage(clientLike, image, {
    enableBlurUp: false,
  });

  return (
    <Box $background="pastelTurqoise" $width="100%">
      <Img {...imageProps} layout="intrinsic" {...rest} />
    </Box>
  );
};

export default CMSImage;
