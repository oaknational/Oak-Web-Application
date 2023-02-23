import { FC, useState } from "react";
import {
  ImageUrlBuilder,
  useNextSanityImage,
  UseNextSanityImageBuilder,
} from "next-sanity-image";
import { SanityClientLike } from "@sanity/image-url/lib/types/types";

import config from "../../config/browser";
import Box from "../Box";
import { Image } from "../../common-lib/cms-types";
import OakImage, { OakImageProps } from "../OakImage";

export type CMSImageProps = Omit<OakImageProps, "src" | "alt"> & {
  children?: React.ReactNode;
  image: Image;
  alt?: string;
  imageBuilder?: UseNextSanityImageBuilder;
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

const defaultImageBuilder =
  ({ width, height }: { width?: number | string; height?: number | string }) =>
  (builder: ImageUrlBuilder) =>
    typeof width === "number" && typeof height === "number"
      ? builder.format("webp").width(width).height(height)
      : builder.format("webp");

const CMSImage: FC<CMSImageProps> = ({ image, imageBuilder, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  imageBuilder = imageBuilder || defaultImageBuilder(rest);

  const { width, height, ...imageProps } = useNextSanityImage(
    sanityClientLike,
    image,
    {
      imageBuilder,
    }
  );

  // If alt is explicitly provided, use it even if it's empty
  // otherwise attempt the one from the CMS, or fall back to empty
  const altTextString =
    typeof rest.alt === "string" ? rest.alt : image.altText || "";

  /**
   * alt="" as per:
   * https://www.w3.org/WAI/tutorials/images/decorative/
   * > In these cases, a null (empty) alt text should be provided (alt="")
   * > so that they can be ignored by assistive technologies, such as screen readers.
   */
  const finalAltText = image.isPresentational ? "" : altTextString;

  /**
   * If `width` and `fill` are both passed, next/image throws an error
   */
  const dimensions = rest.fill ? {} : { width, height };

  return (
    <Box $background={loaded ? undefined : "pastelTurquoise"} $width="100%">
      <OakImage
        onLoadingComplete={() => setLoaded(true)}
        {...imageProps}
        {...dimensions}
        {...rest}
        alt={finalAltText}
        // $height: auto to keep original aspect ratio of image
        $height={rest.$height || rest.$cover ? undefined : "auto"}
        aria-hidden={image.isPresentational ? true : undefined}
      />
    </Box>
  );
};

export default CMSImage;
