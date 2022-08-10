import { FC } from "react";
import Img from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import {
  SanityClientLike,
  SanityImageSource,
} from "@sanity/image-url/lib/types/types";

import config from "../../config";

type CMSImageProps = {
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
    apiHost: "https://cdn.sanity.io",
  },
};

const CMSImage: FC<CMSImageProps> = ({ image }) => {
  const imageProps = useNextSanityImage(clientLike, image);

  return (
    <Img
      {...imageProps}
      layout="intrinsic"
      //   sizes="(max-width: 1200px) 12vw, 800px"
    />
  );
};

export default CMSImage;
