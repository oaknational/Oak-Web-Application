import { FC } from "react";
import Img, { ImageProps } from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import {
  SanityClientLike,
  SanityImageSource,
} from "@sanity/image-url/lib/types/types";

import config from "../../config";

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
    apiHost: `https://${config.get("sanityApiHost")}`,
  },
};

const CMSImage: FC<CMSImageProps> = ({ image, ...rest }) => {
  const imageProps = useNextSanityImage(clientLike, image);

  return (
    <Img
      {...imageProps}
      layout="intrinsic"
      {...rest}
      //   sizes="(max-width: 1200px) 12vw, 800px"
    />
  );
};

export default CMSImage;
