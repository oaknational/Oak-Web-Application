"use client";
import { FC, useCallback, useMemo } from "react";
import { ImageLoader } from "next/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import {
  getImageDimensions,
  getSanityRefId,
  imageBuilder,
} from "@/components/HooksAndUtils/sanityImageBuilder";
import { Image } from "@/common-lib/cms-types";
import type { SizeValues } from "@/styles/theme/types";
import OwaImage, {
  OwaImageProps,
} from "@/components/SharedComponents/OwaImage";

function getAspectRatio({
  cropRect,
  width,
  height,
  originalDimensions,
}: Pick<CMSImageProps, "cropRect" | "width" | "height"> & {
  originalDimensions?: { aspectRatio?: number };
}) {
  if (cropRect) {
    return cropRect[2] / cropRect[3];
  }
  if (width && height) {
    return width / height;
  }

  if (originalDimensions?.aspectRatio) {
    return originalDimensions.aspectRatio;
  }

  return null;
}

export type CMSImageProps = Omit<OwaImageProps, "src" | "alt"> & {
  /**
   * Sanity image asset
   */
  image: Omit<SanityImageSource, "string"> | Image;
  /**
   * width for transform
   */
  width?: number;
  /**
   * height for transform
   */
  height?: number;
  children?: React.ReactNode;
  alt?: string;
  /**
   * @next/image loader to override the default
   */
  loader?: ImageLoader;
  /**
   * In the case when we want to fetch an image from Sanity with specific dimensions,
   * but we don't want sanity to crop the original image, pass `noCrop`.
   * For example, passing width: 400, height:400, noCrop: true; will mean ask
   * the CDN for an image that fits within a 400 by 400 square. F.i. the image
   * returned might be 400x320 or 126x400
   * If noCrop is not passed, then a crop will be applied. This crop is applied
   * by @sanity/url-builder
   * Is nullified if `cropRect` prop is passed
   */
  noCrop?: boolean;
  /**
   * Crop rectangle in pixels (left, top, width, height)
   * @see https://www.sanity.io/docs/image-urls#rect-b9848ab43728
   */
  cropRect?: [number, number, number, number];
  /**
   * Format: "webp" | null (set null if source is svg and you want to keep it as svg)
   */
  format?: "webp" | null;
};

const CMSImage: FC<CMSImageProps> = (props) => {
  const {
    image,
    loader: propsLoader,
    noCrop,
    cropRect,
    format = "webp",
    ...rest
  } = props;

  const id = getSanityRefId(image);
  const originalDimensions = getImageDimensions(id, { fill: rest.fill });

  const defaultLoader = useCallback(
    ({ width: srcWidth }: { width: number }) => {
      let builtImage = imageBuilder
        .image(image)
        .width(srcWidth)
        .auto("format")
        .quality(80)
        .fit("clip");

      const aspectRatio = getAspectRatio({
        width: props.width,
        height: props.height,
        originalDimensions,
        cropRect,
      });

      if (format) {
        builtImage = builtImage.format(format);
      }

      if (aspectRatio) {
        builtImage = builtImage.height(Math.floor(srcWidth / aspectRatio));
      }

      if (cropRect) {
        builtImage = builtImage.rect(...cropRect);
      }

      if (
        !cropRect &&
        noCrop &&
        originalDimensions.width &&
        originalDimensions.height
      ) {
        builtImage = builtImage.rect(
          0,
          0,
          originalDimensions.width,
          originalDimensions.height,
        );
      }

      return builtImage.url();
    },
    [
      image,
      noCrop,
      originalDimensions,
      props.height,
      props.width,
      cropRect,
      format,
    ],
  );

  const loader: ImageLoader = propsLoader || defaultLoader;

  /**
   * If alt is explicitly provided, use it even if it's empty otherwise attempt
   * the one from the CMS, or fall back to empty
   */
  const altTextFromCMS = "altText" in image ? image.altText : undefined;
  const altTextString =
    typeof rest.alt === "string" ? rest.alt : altTextFromCMS || "";
  const isPresentational =
    "isPresentational" in image ? image.isPresentational : false;
  /**
   * alt="" as per:
   * https://www.w3.org/WAI/tutorials/images/decorative/
   * > In these cases, a null (empty) alt text should be provided (alt="")
   * > so that they can be ignored by assistive technologies, such as screen readers.
   */
  const finalAltText = isPresentational ? "" : altTextString;

  /**
   * finalUrl is the proxied url
   */
  const finalUrl = useMemo(
    () => (image ? imageBuilder.image(image).url()?.toString() : null),
    [image],
  );

  if (!finalUrl) {
    return null;
  }

  /**
   * $width/$height to be passed to css
   */
  const styleDimensions: { $width?: SizeValues; $height?: SizeValues } = {
    $width: rest.$width || (rest.$cover ? undefined : "100%"),
    $height: rest.$height || (rest.$cover ? undefined : "auto"),
  };
  /**
   * width/height to be passed to @next/image, so that it can apply appropriate
   * optimisations
   */
  const nextImageDimensions = {
    width: props.width || originalDimensions.width,
    height: props.height || originalDimensions.height,
  };

  return (
    <OwaImage
      {...rest}
      {...styleDimensions}
      {...nextImageDimensions}
      alt={finalAltText}
      aria-hidden={isPresentational ? true : undefined}
      src={finalUrl}
      loader={loader}
    />
  );
};

export default CMSImage;
